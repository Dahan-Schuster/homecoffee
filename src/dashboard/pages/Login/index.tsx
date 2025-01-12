import React, { useState } from 'react'
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { CircularProgress } from "@mui/material"
import { Formik, Form } from 'formik';
import type { FormikHelpers } from 'formik';
import './style.scss';
import { useUser } from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useMuiTheme } from '../../../hooks/useMuiTheme';
import { useApi } from '../../../common/hooks/useApi';
import { User } from '../../contexts/userContext';

interface formValues {
    user: string
    password: string
}

export const Login = () => {
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState('')

    const { setUser } = useUser()
    const navigate = useNavigate()
    const api = useApi()

    const initialValues:formValues = {
        user: '',
        password: ''
    }

    const handleSubmit = React.useCallback((values:formValues, helpers: FormikHelpers<formValues>) => {
        if (loading) return;
        setLoading(true)
        setLoginError('')

        api.login(values, (response: { data: User | null }) => {
            if(response.data) {
                setUser(response.data)
                navigate('/dashboard/panel')
            } else {
                setLoginError('usuário ou senha inválidos')
            }
        }, (error: any) => {
            console.error(error)
            setLoginError('erro interno')
        }, () => setLoading(false))
    }, [loading])
    
    return (
        <div className='Login-Page' >
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({values, handleChange}) => 
                <Form>
                    <img className='logo' src='/images/logo.png' alt='logo.png' />
                    {/* <h2 className='title' >login</h2> */}
                    <TextField label='usuário ou e-mail' id='user' value={values.user} onChange={handleChange} color='primary' />
                    <TextField label='senha' type='password' id='password' value={values.password} onChange={handleChange} />
                    <Button type='submit' variant="contained" >
                        {
                            loading ?
                            <CircularProgress size={'1.5rem'} color={'secondary'} />
                            :
                            <>Entrar</>
                        }
                    </Button>
                </Form>}
            </Formik>
            <Snackbar open={Boolean(loginError)} autoHideDuration={3000} onClose={() => setLoginError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={() => setLoginError('')} severity={'error'} sx={{ width: '100%' }}>
                    {loginError}
                </Alert>
            </Snackbar>
        </div>
    )
}