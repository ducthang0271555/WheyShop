from ..extensions import db

class HashTag(db.Model):
    __tablename__ = 'hash_tags'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f'<HashTag {self.name}>'