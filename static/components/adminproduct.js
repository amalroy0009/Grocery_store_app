const Product=Vue.component("Product",{
    template:
            `<div>
                <h1 class="centered_header"><b>{{category}}</b></h1>
                <h2 style=color:DodgerBlue;><button @click="exportcsv" class="btn btn-success float-right">Export as csv</button></h2>
                <div>
                <!-- Button trigger modal -->
                <button type="button" class="button-73" data-toggle="modal" data-target="#exampleModal">
                  Add  Product
                </button>
                 
                <!-- Modal -->
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add a new Product</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label><span class="label label-default">product</span></label>
                        <input type="text" class="form-control"  name="produt" v-model="product">
                        <label><span class="label label-default">Price</span></label>
                        <input type="number" class="form-control"  name="rpice" v-model="price">
                        <label><span class="label label-default">Quantity</span></label>
                        <input type="number" class="form-control"  name="quantity" v-model="quantity">
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="addproduct">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in items" :key="i.id">
                    <td>{{i.id}}</td>
                    <td>{{i.product}}</td>
                    <td>{{i.price}}</td>
                    <td>{{i.quantity}}</td>
                    <td><router-link :to="{name:'update',params:{id:i.id}}"><button class="btn btn-warning">Update</button></router-link></td>
                    <td><button @click="remove(i.id)" type="button" class="btn btn-danger">Remove</button></td>
                  </tr>
                  
                </tbody>
              </table>
                </div>
            </div>`,
    data:function(){
      return{
         
        category:this.$route.params.product,
        product:'',price:'',quantity:'',
        
        items:[]
      }
      },
      
      mounted:function(){
      console.log(this.category)
      fetch(`/${this.category}/details`).then(response=>response.json()).then(data=>{console.log(data[0]);this.items=data}).then(console.log(this.user))
    },
    methods:{
      addproduct:function(){
        const productdata={product:this.product,price:this.price,quantity:this.quantity}
        fetch(`/${this.category}/addproduct`, {
          method: "POST",
          headers: { "content-type": "application/json", },
          body: JSON.stringify(productdata),
      }).then((response) => response.json().then(data=>{console.log(data);this.$router.go();this.$router.push(`/${this.category}`)}))
      },
      exportcsv:function(){
        fetch(`/${this.category}/generate_csv`).then(r=>r.json())
      },
      remove(id){
          fetch(`/${id}/deleteproduct`).then(r=>r.json())
      }
    }     
})

export default Product