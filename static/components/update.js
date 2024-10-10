const Update=Vue.component("update",{
    template:
            `<div>
                <h1 class="centered_header">{{this.$route.params.id}}</h1>
                <div>
                <!-- Button trigger modal -->
                <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#exampleModal">
                  Update
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
                        
                        <label><span class="label label-default">Price</span></label>
                        <input type="number" class="form-control"  name="rpice" v-model="price">
                        <label><span class="label label-default">Quantity</span></label>
                        <input type="number" class="form-control"  name="quantity" v-model="quantity">
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="update">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                <br>
                
            </div>`,
    data:function(){
      return{
         
        id:this.$route.params.id,
        price:'',quantity:'',
        
        items:[]
      }
      },
      
      
    methods:{
      update:function(){
        const productdata={price:this.price,quantity:this.quantity}
        fetch(`/${this.id}/update`, {
          method: "POST",
          headers: { "content-type": "application/json", },
          body: JSON.stringify(productdata),
      }).then((response) => response.json().then(data=>{console.log(data);this.$router.go();this.$router.push('/categories')}))
      }
    }     
})

export default Update