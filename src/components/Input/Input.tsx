'use client'

import { Form } from 'react-bootstrap'
import styles from './Input.module.css'

interface Props {
    [key: string]: string | boolean,
    id: string
}

export default function Input({id, ...props}: Props){
    return (

        <>
            <Form.Group controlId={id} className=''>
                <Form.Label className={`${styles.label}`}>{props.label}</Form.Label>
                <Form.Control {...props} className={`${styles.input} mt-1`} isInvalid={false}/>
                <Form.Control.Feedback type="invalid" className={styles.feedback}>
                {props.feedback}
                </Form.Control.Feedback>
            </Form.Group>
        </>
        
    )
}