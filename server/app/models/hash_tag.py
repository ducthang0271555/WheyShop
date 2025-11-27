from ..extensions import db

class HashTag(db.Model):
    __tablename__ = 'hash_tags'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<HashTag {self.name}>'