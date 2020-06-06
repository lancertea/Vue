/**
 * Mocking client-server processing
 */
const _products = [
  {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
  {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
  {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5}
]

export default {
  // 获取所有商品，异步模拟 ajax
  getProducts (cb) {
    setTimeout(() => cb(_products), 100)
  },

  // 结账，异步模拟 ajax
  buyProducts (products, cb, errorCb) {
    setTimeout(() => {
      // simulate random checkout failure.
      // 模拟可能失败的情况
      (Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1)
        ? cb()
        : errorCb()
    }, 100)
  }
}

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