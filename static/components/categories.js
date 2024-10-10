const Categories=Vue.component("categories",{
    template:`<div>
                
                <div class="box" v-for="i in category" :key="i.id">
                    <router-link :to="{name:'product',params:{product:i.category}}"><button class="btn btn-secondary">{{i.category}}</button></router-link>
                    
                </div>
                    
 
            </div>`,
    data:function(){
        return{
            category:[],cat:""
        }

    },
    
    mounted:function(){
        fetch("/user/getcategories",{headers:{'Authentication-Token':localStorage.getItem('token')}}).then(response=>response.json()).then(data=>{console.log(data);this.category=data})
    },
    
    

    
           

})

export default Categories;