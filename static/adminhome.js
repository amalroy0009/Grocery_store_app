import Categories from "./components/admincategory.js"
import Product from "./components/adminproduct.js"
import Update from "./components/update.js"

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
        path:"/:id/update",
        component:Update,
        props:true,
        name:'update'
      }
        
    
    
]

const router=new VueRouter({
    routes,
})

new Vue({
    el:"#app",
    router:router,
    data:{
        message:"hello world how r u",
    },
     delimiters: ['{','}'],


})