import base64
import os
import json
import time
from datetime import datetime
from nexttoken import NextToken
from apps.khayal_masr.backend.db import _get_db, init_db

# Initialize database on first import
init_db()

UPLOADS_DIR = "apps/khayal_masr/backend/data/uploads"
PAYMENTS_DIR = "apps/khayal_masr/backend/data/payments"
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(PAYMENTS_DIR, exist_ok=True)

def generate_story_streaming(**args):
    """
    Generates an Egyptian Ammiya story using Gemini.
    Yields progress/chunks. Saves to DB.
    """
    child_name = args.get("child_name", "طفل")
    age = args.get("age", 5)
    gender = args.get("gender", "ذكر")
    challenge_type = args.get("challenge_type", "شجاعة")
    custom_text = args.get("custom_text", "")

    print(f"[BACKEND_START] generate_story_streaming for {child_name}, age {age}")

    conn = _get_db()
    try:
        # Create initial story record
        cursor = conn.execute("""
            INSERT INTO stories (child_name, age, gender, challenge_type, custom_challenge_text, status)
            VALUES (?, ?, ?, ?, ?, 'generating')
        """, (child_name, age, gender, challenge_type, custom_text))
        conn.commit()
        story_id = cursor.lastrowid
        print(f"[BACKEND_STEP] Created story record with ID {story_id}")

        yield {"status": "Preparing the magic...", "progress": 10, "story_id": story_id}

        client = NextToken()
        
        prompt = f"""
        Write a personalized children's story in Egyptian Arabic (Ammiya).
        The child's name is {child_name}, age {age}, gender {gender}.
        The theme of the story is: {challenge_type}.
        Additional context: {custom_text}
        
        The story should be:
        1. In authentic, warm, and engaging Egyptian Ammiya.
        2. Educational and empowering.
        3. Suitable for a {age} year old.
        4. About 300-500 words.
        5. Include a title at the beginning.
        
        Format the output with a clear Title and then the story paragraphs.
        """

        yield {"status": "Gathering stars for the story...", "progress": 30}

        response = client.chat.completions.create(
            model="gemini-3.1-flash-lite-preview",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=4000
        )
        
        story_content = response.choices[0].message.content
        print(f"[BACKEND_STEP] Story generated for ID {story_id}")

        yield {"status": "Adding final touches...", "progress": 80}

        # Update story with content and set status to ready
        conn.execute("""
            UPDATE stories SET content = ?, status = 'ready' WHERE id = ?
        """, (story_content, story_id))
        conn.commit()

        print(f"[BACKEND_SUCCESS] generate_story_streaming complete for ID {story_id}")
        yield {
            "status": "Story is ready!", 
            "progress": 100, 
            "result": {
                "id": story_id,
                "content": story_content,
                "status": "ready"
            }
        }

    except Exception as e:
        print(f"[BACKEND_ERROR] generate_story_streaming failed: {str(e)}")
        yield {"status": "Error", "progress": 0, "error": str(e)}
    finally:
        conn.close()

def upload_child_photo(**args):
    """Saves child's photo and updates story record."""
    story_id = args.get("story_id")
    image_base64 = args.get("image_base64")
    
    print(f"[BACKEND_START] upload_child_photo for story_id {story_id}")
    
    if not story_id or not image_base64:
        raise ValueError("Missing story_id or image_base64")

    try:
        # Handle data URL prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
            
        image_data = base64.b64decode(image_base64)
        filename = f"child_{story_id}_{int(time.time())}.png"
        filepath = os.path.join(UPLOADS_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(image_data)
        
        print(f"[BACKEND_STEP] Photo saved to {filepath}")
        
        conn = _get_db()
        try:
            conn.execute("UPDATE stories SET photo_path = ? WHERE id = ?", (filepath, story_id))
            conn.commit()
            row = conn.execute("SELECT * FROM stories WHERE id = ?", (story_id,)).fetchone()
            print(f"[BACKEND_SUCCESS] Photo uploaded for story_id {story_id}")
            return dict(row)
        finally:
            conn.close()
    except Exception as e:
        print(f"[BACKEND_ERROR] upload_child_photo failed: {str(e)}")
        raise

def submit_payment(**args):
    """Records payment screenshot and sets status to 'paid'."""
    story_id = args.get("story_id")
    screenshot_base64 = args.get("screenshot_base64")
    amount = args.get("amount", 0.0)
    
    print(f"[BACKEND_START] submit_payment for story_id {story_id}")
    
    if not story_id or not screenshot_base64:
        raise ValueError("Missing story_id or screenshot_base64")

    try:
        if "," in screenshot_base64:
            screenshot_base64 = screenshot_base64.split(",")[1]
            
        image_data = base64.b64decode(screenshot_base64)
        filename = f"payment_{story_id}_{int(time.time())}.png"
        filepath = os.path.join(PAYMENTS_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(image_data)
        
        conn = _get_db()
        try:
            conn.execute("""
                INSERT INTO payments (story_id, screenshot_path, amount, status)
                VALUES (?, ?, ?, 'pending')
            """, (story_id, filepath, amount))
            conn.execute("UPDATE stories SET status = 'paid' WHERE id = ?", (story_id,))
            conn.commit()
            
            row = conn.execute("SELECT * FROM stories WHERE id = ?", (story_id,)).fetchone()
            print(f"[BACKEND_SUCCESS] Payment submitted for story_id {story_id}")
            return dict(row)
        finally:
            conn.close()
    except Exception as e:
        print(f"[BACKEND_ERROR] submit_payment failed: {str(e)}")
        raise

def get_story_details(**args):
    """Fetches story status and metadata for user tracking."""
    story_id = args.get("story_id")
    print(f"[BACKEND_START] get_story_details for ID {story_id}")
    
    conn = _get_db()
    try:
        row = conn.execute("SELECT * FROM stories WHERE id = ?", (story_id,)).fetchone()
        if not row:
            print(f"[BACKEND_ERROR] Story {story_id} not found")
            return {"error": "Story not found"}
        
        story = dict(row)
        # Fetch payment info if exists
        payment_row = conn.execute("SELECT * FROM payments WHERE story_id = ?", (story_id,)).fetchone()
        if payment_row:
            story["payment"] = dict(payment_row)
            
        print(f"[BACKEND_SUCCESS] Found story details for ID {story_id}")
        return story
    finally:
        conn.close()

def get_samples(**args):
    """Returns a list of sample stories/PDFs for the showcase."""
    print("[BACKEND_START] get_samples")
    conn = _get_db()
    try:
        rows = conn.execute("SELECT * FROM samples ORDER BY created_at DESC").fetchall()
        print(f"[BACKEND_SUCCESS] Returning {len(rows)} samples")
        return [dict(r) for r in rows]
    finally:
        conn.close()

def admin_update_status(**args):
    """Admin updates order status."""
    story_id = args.get("story_id")
    status = args.get("status")
    
    print(f"[BACKEND_START] admin_update_status for ID {story_id} to {status}")
    
    conn = _get_db()
    try:
        conn.execute("UPDATE stories SET status = ? WHERE id = ?", (status, story_id))
        conn.commit()
        row = conn.execute("SELECT * FROM stories WHERE id = ?", (story_id,)).fetchone()
        print(f"[BACKEND_SUCCESS] Status updated for ID {story_id}")
        return dict(row)
    finally:
        conn.close()

def admin_add_sample(**args):
    """Allows admin to add new PDF/Image samples."""
    title = args.get("title")
    file_base64 = args.get("file_base64")
    file_type = args.get("file_type") # image/pdf
    
    print(f"[BACKEND_START] admin_add_sample: {title}")
    
    try:
        if "," in file_base64:
            file_base64 = file_base64.split(",")[1]
            
        file_data = base64.b64decode(file_base64)
        ext = "pdf" if "pdf" in file_type.lower() else "png"
        filename = f"sample_{int(time.time())}.{ext}"
        filepath = os.path.join(UPLOADS_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(file_data)
            
        conn = _get_db()
        try:
            cursor = conn.execute("""
                INSERT INTO samples (title, file_url, type)
                VALUES (?, ?, ?)
            """, (title, filepath, file_type))
            conn.commit()
            sample_id = cursor.lastrowid
            row = conn.execute("SELECT * FROM samples WHERE id = ?", (sample_id,)).fetchone()
            print(f"[BACKEND_SUCCESS] Sample added: {title}")
            return dict(row)
        finally:
            conn.close()
    except Exception as e:
        print(f"[BACKEND_ERROR] admin_add_sample failed: {str(e)}")
        raise

__all__ = [
    "generate_story_streaming",
    "upload_child_photo",
    "submit_payment",
    "get_story_details",
    "get_samples",
    "admin_update_status",
    "admin_add_sample",
    "admin_login",
    "get_whatsapp_link",
    "admin_get_orders"
]
