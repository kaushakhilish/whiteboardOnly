import React, { useContext } from 'react';
import { AppContext, URL } from '../context/appContext';
import styles from './loginPage.module.css';

const LogInPage = ({ setPage }) => {

    const { setUser } = useContext(AppContext);

    function loginUser(e) {
        e.preventDefault();
        let email = e.target[0].value;
        let password = e.target[1].value;
        console.log(email, password)

        if (email && password) {
            fetch(URL + 'login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.name) {
                        setUser(data)
                        setPage('home')
                    }
                })
        } else {
            alert('Fill All Inputs!!')
        }
    }

    return (
        <div className={styles.loginPage}>
            <form onSubmit={loginUser}>
                <input type="email" placeholder='Enter Email' />
                <input type="password" placeholder='Enter Password' />
                <button>Log in</button>
                <p style={{
                    color: 'white',
                    fontFamily: 'sans-serif',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
                    onClick={() => setPage('signup')}>New? Signup Here!</p>
            </form>
        </div>
    );
}

export default LogInPage;
