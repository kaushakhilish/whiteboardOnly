import React from 'react';
import { URL } from '../context/appContext';
import styles from './signUp.module.css'

const SignUp = ({ setPage }) => {

    function signUpUser(e) {
        e.preventDefault();
        let userName = e.target[0].value;
        let email = e.target[1].value;
        let password = e.target[2].value;
        console.log(userName, email, password)
        if (userName && email && password) {
            fetch(URL+'users/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password
                })
            }).then(res => res.json())
            .then(data => {
                console.log(data)
                if(data.name){
                    setPage('login')
                }
            })
        } else {
            alert('Fill All Inputs!!')
        }

    }

    return (
        <div className={styles.signUp}>
            <form onSubmit={signUpUser}>
                <input type="text" placeholder='Enter Username' />
                <input type="email" placeholder='Enter Email' />
                <input type="password" placeholder='Enter Password' />
                <button>Log in</button>
                <p style={{
                    color: 'white',
                    fontFamily: 'sans-serif',
                    cursor: 'pointer',
                    marginTop: '10px'
                }} onClick={() => setPage('login')}>Already Have an account? Login Here!</p>
            </form>
        </div>
    );
}

export default SignUp;
