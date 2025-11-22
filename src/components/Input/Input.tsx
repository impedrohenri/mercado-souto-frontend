'use client'

import styles from './Input.module.css'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { FieldInput } from '../ui/input'

interface Props extends React.ComponentProps<"input"> {
    id: string,
    description?: string,
    error?: string,
    label?: string
    fieldState?: {
        invalid: boolean
    }
}

export default function Input({ id, ...props }: Props) {
    return (

        <>
            <Field className='gap-1' data-invalid={props.fieldState?.invalid}>
                <FieldLabel className={`${styles.label}`}>{props.label}</FieldLabel>

                <FieldInput {...props} className={`${styles.input} mt-1`} />

                {props.description && <FieldDescription> {props.description} </FieldDescription>}

                {props.error && <FieldError className={styles.error}>{props.error}</FieldError>}

                
            </Field>
        </>

    )
}