import { NextResponse } from 'next/server'

export default function middleware(req) {
    const baseURL = req.nextUrl['origin']
    let verify = req.cookies.get('loggedin')
    //console.log(req)
    let url = req.url

    /*if(!verify && (url.includes('/searches') || url.includes("/items"))){
        return NextResponse.redirect(baseURL + "/login");
    }

    if(verify && url.includes('/login') ){
        return NextResponse.redirect(baseURL + "/dashboard")
    }*/
}
