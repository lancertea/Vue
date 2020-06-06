import Vue from 'vue'

export default new Vue()

/*
数据结构设计：
{productionList:[
  {
    id:1,
    title:"商品1",
    price:10
  },
  ...
],
cartList:[
  {
  id:1,
  quantity:1
  },
  ...
]
}


组件设计
<App>管理所有数据 
  <ProductionList>   商品列表
      <ProductionListItem/>
      <ProductionListItem/>
      <ProductionListItem/>
  </ProductionList> 
  <CartList>         购物车列表和总价
     <CartItem/>
     <CartItem/>
  </CartList>
</App>
     
*/