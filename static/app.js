import Product from "./components/product.js"
import Categories from "./components/categories.js"
import Cart from "./components/cartmodal.js"
import Mycart from "./components/mycart.js"


const routes=[
  {
    path:"/categories",
    component:Categories,
    
},
    
  
  {
      path:"/:product",
      component:Product,
      props:true,
      name:'product'
      
  },
  {
    path:"/:id/add_to_cart ",
    component:Cart,
    props:true,
    name:'cart'
  },
  {
    path:"/:user/mycart",
    component:Mycart,
    props:true,
    name:'mycart'
  }
      
  
  
]

const router=new VueRouter({
  routes,
})

new Vue({
    el:"#app",
    template:`<div>
                      <div>
                      
                      <button @click="logout" style="float: right; margin-right: 30x;margin-top:20px" class="btn btn-secondary" >Logout</button>
                      <router-link :to="{name:'mycart',params:{user}}"><button style="float: right;margin-right:20px;margin-top:20px" class="btn btn-primary">Cart</button></router-link>
                      <br>
                          <div>
                          <nav class="navbar navbar-expand-lg navbar-light bg-light">
                          <a class="navbar-brand" href="#"><h3><b>{this.user}</b></h3></a>
                          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                          </button>
                          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                              <a class="nav-item nav-link active" href="/home"><button class="button-17">Home</button><span class="sr-only">(current)</span></a>
                              <a class="nav-item nav-link"><router-link to="/categories"><button class="button-17">Categories</button></router-link></a>
                              
                              
                            </div>
                            
                          </div>
                          </nav>
                          
                          
                          <br>

                          <!-- <div><button class="btn btn-success">Add Category</button></div>
                              <div class="box"><router-link to="/categories"><button class="btn btn-success">Munchies</button></router-link></div>
                              <div class="box">this is a box</div>
                              -->
                          
                                  
                      </div>
                      <router-view></router-view>

                  </div>
                                    
              </div>`,
    
    data:{
        message:"hello world how r u",
        categories:[],
        user:document.getElementById("app").getAttribute("data-some-data")
        
    },
    router:router,
    delimiters: ['{','}'],
    mounted: function(){
        localStorage.setItem('user',this.user)
        fetch("/home",{headers:{'Authentication-Token':localStorage.getItem('token')} }).then(console.log(this.user)) 
    },
    methods:{
      logout:function(){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href='/logout'

      }
    },
    

})

