from flask_sqlalchemy import SQLAlchemy


db=SQLAlchemy()

class products(db.Model):
    id=db.Column(db.Integer(),primary_key=True)
    category=db.Column(db.String(50),unique=True)
    product=db.Column(db.String(50),unique=False)
    price=db.Column(db.Integer(),nullable=False)
    quantity=db.Column(db.String(5),nullable=False)

    def __repr__(self):
        return f'{self.product}'
