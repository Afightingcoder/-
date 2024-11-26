import {createBrowserRouter,Navigate} from 'react-router-dom'
import Main from '../pages/main'
import Home from '../pages/home'
import Mall from '../pages/mall'
import PageA from '../pages/other/pageA'
import PageB from '../pages/other/pageB'
import User from '../pages/user'
import Login from '../pages/login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

// 路由表写法
const routes = [
    {
        path:'/',
        Component: Main,
        children: [
            // 访问根路径时，默认重定向到home页面  
            {
                path:'/',
                element:<Navigate to='home' />
            },
            {
                path:'home',
                Component:Home
            },
            {
                path:'mall',
                Component:Mall
            },
            {
                path:'user',
                Component:User
            },
            {
                path:'other',
                children: [
                        {
                            path:'pagea',
                            Component:PageA
                        },
                        {
                            path:'pageb',
                            Component:PageB
                        },
                    
                ]
            }
        ]
    },
    {
        path:'/login',
        Component:Login
    }

]

export default createBrowserRouter(routes)



// 组件形式的写法
// const baseRouter = () =>{
//     该路由组件中若有处理逻辑 则需要用return包裹
//     return( 

//     )
// }

//若无 则简写省略return 注意剪头函数的{}变为()
// const baseRouter = () => (
//     <BrowserRouter>
//     <Routes>
//         <Route path='/' element={<Main />}>
//             <Route index element={<Navigate to='home' />} />
//             <Route path='home' element={<Home />} />
//             <Route path='mall' element={<Mall />} />
//             <Route path='user' element={<User />} />
//             <Route path='other' >
//                 <Route path='pagea' element={<PageA />} />
//                 <Route path='pageb' element={<PageB />} />
//             </Route>
//         </Route>
//     </Routes>
//     </BrowserRouter>
// )

// export default baseRouter