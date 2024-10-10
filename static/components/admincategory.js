const Categories=Vue.component("categories",{
    template:`<div>
                <div>
                <!-- Button trigger modal -->
                <button type="button" class="button-85" data-toggle="modal" data-target="#exampleModal">
                  Add category
                </button>
                
                <!-- Modal -->
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add a new Category</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label><span class="label label-default">Category</span></label>
                        <input type="text" class="form-control"  name="cat" v-model="cat">
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="addcategory">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
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
        fetch("/getcategories").then(response=>response.json()).then(data=>{console.log(data);this.category=data})
    },
    methods:{
        addcategory:function(){
            const categorydata={category:this.cat}
            
                fetch('/addcategory', {
                    method: "POST",
                    headers: { "content-type": "application/json", },
                    body: JSON.stringify(categorydata),
                }).then((response) => response.json()).then((data)=>{console.log(data);this.$router.go();this.$router.push('/categories')})
                
            }
        }
    

    
           

})

export default Categories;