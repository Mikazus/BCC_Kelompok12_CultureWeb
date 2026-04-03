import { Suspense } from 'react'
import Login from './login'

const SignInPage = () => {
	return (
		<Suspense fallback={<main className="min-h-screen bg-[#f2efea]" />}>
			<Login />
		</Suspense>
	)
}

export default SignInPage
