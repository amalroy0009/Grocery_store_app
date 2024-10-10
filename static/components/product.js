const Product=Vue.component("Product",{
    template:
            `<div>
                <h1 class="centered_header">{{this.$route.params.product}}</h1>
                <div>
                 
                <br>
                <div>
                <table class="table table-striped">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in items" :key="i.id">
                    <td>{{i.id}}</td>
                    <td>{{i.product}}</td>
                    <td>{{i.price}}</td>
                    <td>{{i.quantity}}</td>
                    <template>
                        <td v-if="i.quantity==0"><button class="btn btn-warning">out of stock</button></td>
                        <td v-else>
                        <router-link :to="{name:'cart',params:{id:i.id}}"><button class="btn btn-warning">Add to cart</button></router-link>
                        </td>
                    </template>
                    
                    
                  </tr>
                  
                </tbody>
              </table>
              </div>
                </div>
            </div>`,
            
    data:function(){
      return{
         
        category:this.$route.params.product,
        product:'',price:'',quantity:'',
        user:localStorage.getItem('user'),
        items:[]
      }
      },
      
      mounted:function(){
      console.log(this.items)
      fetch(`/${this.category}/user/details`,{headers:{'Authentication-Token':localStorage.getItem('token')}}).then(response=>response.json()).then(data=>{console.log(data[0]);this.items=data})
      
    },
    methods:{
        add_cart:function(){
            fetch(`/${this.category}/generate_csv`).then(r=>r.json())
        }
    }
         
})

export default Product