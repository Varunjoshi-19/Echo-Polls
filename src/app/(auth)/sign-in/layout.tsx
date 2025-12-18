interface SignInLayout { 
    children : React.ReactNode;
}

export default function Layout({children} : SignInLayout) {     
return(
    <div>
        {children}
    </div>
)

}