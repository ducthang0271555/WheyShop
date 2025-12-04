export const objectToFormData = (obj, imageFile, imageKey = "image") => {
    const fd = new FormData();

    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            obj[key].forEach((item) => {
                fd.append(key, item);
            });
        } else {
            fd.append(key, obj[key]);
        }
    }

    if (imageFile) fd.append(imageKey, imageFile);

    return fd;
}