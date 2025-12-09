import os
from werkzeug.utils import secure_filename

from app.models import Product


def save_image(img_file, folder_name):
    if not img_file:
        return None

    upload_folder = f"static/images/{folder_name}/"
    os.makedirs(upload_folder, exist_ok=True)

    filename = secure_filename(img_file.filename)
    file_path = os.path.join(upload_folder, filename)

    if not os.path.exists(file_path):
        img_file.save(file_path)

    return f"{upload_folder}{filename}"


def delete_image_if_unused(img_url, model_class, exclude_id=None):
    if not img_url:
        return

    if model_class is Product:
        query = model_class.query.filter(model_class.img_url == img_url)
    else:
        query = model_class.query.filter(model_class.image_url == img_url)

    if exclude_id:
        query = query.filter(model_class.id != exclude_id)

    used_by_other = query.first()

    if not used_by_other:
        if os.path.exists(img_url):
            try:
                os.remove(img_url)
            except Exception as e:
                print(f"Error deleting file {img_url}: {e}")