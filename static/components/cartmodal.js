const Cart=Vue.component("cart",{
    template:
            `<div>
            
            <div>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#exampleModal" float>
              Add to cart
            </button>
             
            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add to cart </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    
                    
                    <br>
                    <label><span class="label label-default">Quantity</span></label>
                    <input type="number" class="form-control"  name="quantity" v-model="quantity">
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" @click="add_cart">Add to cart</button>
                  </div>
                </div>
              </div>
              
            </div>
            </div>
            </div>`,
            data:function(){
                return{
                   
                  id:this.$route.params.id,
                  quantity:null,
                  user:localStorage.getItem('user'),
                  
                  items:[]
                }
                },
                
                
              methods:{
                add_cart:function(){
                  const productdata={quantity:this.quantity,username:this.user}
                  fetch(`/${this.id}/add_to_cart`, {
                    method: "POST",
                    headers: { "content-type": "application/json", },
                    body: JSON.stringify(productdata),
                }).then((response) => response.json().then(data=>{console.log(data)})).then(this.$router.go(),this.$router.push('/categories'))
                }
              }     
          })
          
export default Cart
