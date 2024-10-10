from flask import Flask,render_template,request,jsonify,redirect,url_for,render_template_string
from config import DevelopmentConfig
from flask_sqlalchemy import SQLAlchemy
from flask_security import SQLAlchemyUserDatastore,Security,UserMixin,RoleMixin,auth_required,login_required,current_user
import redis,json
from flask import session
from celery_worker import make_celery
import time,csv





app=Flask(__name__)
# app.secret_key = 'my_secret_key'

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///grocery.db'
app.config.from_object(DevelopmentConfig)

db=SQLAlchemy(app)

redis_url = 'redis://localhost:6379/' 
redis_client = redis.StrictRedis.from_url(redis_url)

#CELERY CONFIGURATION
app.config.update(CELERY_CONFIG={
    'broker_url': 'redis://127.0.0.1:6379',
    'result_backend': 'redis://127.0.0.1:6379',
    'timezone':'Asia/Calcutta',
    'enable_utc':False
})
celery = make_celery(app)

@celery.task()
def send_message():
    return ("hello")

roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(),
                                 db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(),
                                 db.ForeignKey('role.id')))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True)
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
    


class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
class Categories(db.Model):
    id=db.Column(db.Integer(),primary_key=True)
    category=db.Column(db.String(50),unique=True)
    product=db.relationship('Products',backref="categories")

    def __repr__(self):
        return f'{self.category}'
class Products(db.Model):
    id=db.Column(db.Integer(),primary_key=True)
    
    product=db.Column(db.String(50),unique=False)
    price=db.Column(db.Integer(),nullable=False)
    quantity=db.Column(db.String(5),nullable=False)
    category_id=db.Column(db.Integer(),db.ForeignKey('categories.id')) 

    def __repr__(self):
        return f'{self.product}'
    
class Cart(db.Model):
    id=db.Column(db.Integer(),primary_key=True)
    username=db.Column(db.String(),nullable=False)
    product=db.Column(db.String(),nullable=False)
    category=db.Column(db.String(),nullable=False)
    quantity=db.Column(db.Integer(),nullable=False)
    price=db.Column(db.Integer(),nullable=False)

    def __rep__(self):
        return f'{self.username}'    

datastore=SQLAlchemyUserDatastore(db,User,Role)
security=Security(app,datastore)    




@app.route('/')

def home():
    return render_template('login.html')
@app.route('/register',methods=['GET','POST'])
def create_user():
    if request.method=='POST':
        data=request.get_json()
        datastore.create_user(**data)
        db.session.commit()
        return jsonify("user created")
    return render_template('register.html')

@app.route('/admin',methods=['POST','GET'])
def admin():
  if request.method=="POST":
    admin=request.form['username']
    if (admin=="amalroy717"):
      return redirect('/adminhome')
    else:
      return render_template_string("<center><h1>WRONG ADMIN</h1></center>")
  return render_template('adminlogin.html')


 


@app.route('/adminhome')
def admin_home():
    return render_template('adminhome.html')
#GET CATEGORY ROUTE
@app.route('/getcategories')
# @auth_required('token')
def getcategories():
    cached_data = redis_client.get('getcategories_data')
    if cached_data:
        categorydata=json.loads(cached_data)
    else:    
        categorydata=[]
        categories=Categories.query.all()
        for i in categories:
            categorydata.append({'id':i.id,'category':i.category})
            redis_client.setex('getcategories_data', 5, json.dumps(categorydata))
    return categorydata    

#addin caegory post operation
@app.route('/addcategory',methods=['GET','POST'])
def addcategory():
    data=request.get_json()
    newcat=Categories(category=data.get("category"))
    db.session.add(newcat)
    db.session.commit()
    return (jsonify("added"))

@app.route('/<item>/details')
def get_item_details(item):
    item_data=[]
    items=Categories.query.filter_by(category=item).first()
    for i in items.product:
        item_data.append({"id":i.id,"product":i.product,"price":i.price,"quantity":i.quantity})
    return item_data    
@app.route('/<product>/addproduct',methods=['GET','POST'])
def add_product(product):
    x=Categories.query.filter_by(category=product).first()
    data=request.get_json()
    new_product=Products(product=data.get("product"),price=data.get("price"),quantity=data.get("quantity"),category_id=x.id)
    db.session.add(new_product)
    db.session.commit()
    return jsonify("added")

# LoGIN PAGE

@app.route('/home',methods=['GET','POST'])

def login_page():
    
    username=current_user.username
    if username is None:
        return render_template_string("<h1>not logged in</h1>")
    

    return render_template('homepage.html',user=username)
# @app.route('/get_current_user')
# def current_user():
#     user=current_user
#     return user


#UPDATE PRODUCT
@app.route('/<id>/update',methods=['GET','POST'])
def update(id):
    s1=Products.query.get(id)
  
    data=request.get_json()
    
    s1.price=data.get("price")
    s1.quantity=data.get("quantity")
    db.session.commit()
    return jsonify("updated")

#ADD TO CART
@app.route('/<id>/add_to_cart',methods=['GET','POST'])
def add_to_cart(id):
    data=request.get_json()
    s1=Products.query.get(id)
    s2=Cart(username=data.get("username"),product=s1.product,category="asdfsa",quantity=data.get("quantity"),price=(int(data.get("quantity"))*s1.price))
    s1.quantity=int(s1.quantity)-int(data.get("quantity"))
    db.session.add(s2)
    db.session.commit()
    return jsonify("added to cart")

#MY CART ITEMS
@app.route('/<user>/mycart')
def my_items(user):
    items=[]
    s1=Cart.query.filter_by(username=user)
    for i in s1:
        items.append({'id':i.id,'product':i.product,'quantity':i.quantity,'price':i.price})
    return items  

#CANCEL ITEM
@app.route('/<id>/cancelbooking')
def cancel_item(id):
    s1=Cart.query.get(id)
    db.session.delete(s1)
    db.session.commit()
    return jsonify("hello")

#ORDER PLACING
@app.route('/<user>/order_placed')
def order_placed(user):
    s1=Cart.query.filter_by(username=user)
    for i in s1:
        db.session.delete(i)
    db.session.commit()
    return jsonify("order placed sucessfully")      

    
#CELERY TASK(excel sheet)  
@celery.task()

def generate_csv(cat):
  time.sleep(10)
  product=[]
  s1=Categories.query.filter_by(category=cat).first()
  for i in s1.product :
    product.append([i.id,i.product,i.categories,i.price,i.quantity])
  fields=['ID','PRODUCT','CATEGORY','PRICE','Quantity']
  with open('static/show_data.csv','w') as csvfile:
    csvwriter=csv.writer(csvfile)
    csvwriter.writerow(fields)
    csvwriter.writerows(product)
  return ("created")
@app.route('/<category>/generate_csv')
def gen_csv(category):
    print(type(category))
    generate_csv.delay(category)
    
    return jsonify("csv generated")

#DELETE PRODUCT
@app.route('/<id>/deleteproduct')
def delete_product(id):
    s1=Products.query.get(id)
    db.session.delete(s1)
    db.session.commit()
    return jsonify("deleted")

@app.route('/user/getcategories')
@auth_required('token')
def user_getcategories():
    cached_data = redis_client.get('getcategories_data')
    if cached_data:
        categorydata=json.loads(cached_data)
    else:    
        categorydata=[]
        categories=Categories.query.all()
        for i in categories:
            categorydata.append({'id':i.id,'category':i.category})
            redis_client.setex('getcategories_data', 5, json.dumps(categorydata))
    return categorydata    

@app.route('/<item>/user/details')
@auth_required('token')
def user_get_item_details(item):
    cached_data=redis_client.get('getproducts_data')
    if cached_data:
        item_data=json.loads(cached_data)
    else:    
        item_data=[]
        items=Categories.query.filter_by(category=item).first()
        for i in items.product:
            item_data.append({"id":i.id,"product":i.product,"price":i.price,"quantity":i.quantity})
            redis_client.setex('getproducts_data',10,json.dumps(item_data))
    return item_data    


if __name__=="__main__":
    with app.app_context():
        db.create_all()

    
    app.run(debug=True)

