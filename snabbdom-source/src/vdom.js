//用JS模拟DOM结构
<div id="div1" class="container">
    <p>vdom</p>
    <ul style="font-size:20px">
    <li>a</li>
    </ul>
</div>


// var Vnode={
//     tag:'div',
//     props: {
//         id:'div1'
//         className:'container'
//      }
//     children:[
//         {
//             tag:'p'
//             children:'vdom'
//         },
//         {
//             tag:'ul',
//             props:{style:"font-size:20px"}
//             children:[
//                 {
//                     tag:'li',
//                     children:'a'
//                 }
//             ]
//         }
//     ]

// }