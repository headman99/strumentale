import { NextResponse } from 'next/server'

export default function middleware(req) {
    let baseURL = 'http://localhost:3000'
    //let baseURL = "https://app.strumentale.it"
    //In middleware I only have access to data on serve side, so I cannot access localStorage
    let verify = req.cookies.get('loggedin')
    const allCookies = req.cookies.getAll()
    console.log(allCookies)
    let url = req.url

    /*if(!verify && url.includes('/dashboard')){
        return NextResponse.redirect(baseURL + "/login");
    }

    if(verify && url.includes('/login') ){
        return NextResponse.redirect(baseURL + "/dashboard")
    }*/
}
