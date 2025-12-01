import Button from "@/components/Button/Button";
import { Field, FieldError } from "@/components/ui/field";
import { FieldInput } from "@/components/ui/input";
import { useFieldArray, Controller } from "react-hook-form";
import { Attribute } from "./ProductFormSchema";

export default function AttributeFields({ groupIndex, control }: { groupIndex: number, control: any }){
    
    const { fields: attributeFields, append: appendAttr, remove: removeAttr } = useFieldArray({
        control,
        name: `specifications[${groupIndex}].attributes`,
    });

    return (
        <div className="flex flex-col gap-3 ml-4 border-l pl-4">
            {attributeFields.map((item, attrIndex) => (
                <div key={item.id} className="flex gap-4 items-center">
                    <Controller
                        control={control}
                        name={`specifications[${groupIndex}].attributes[${attrIndex}].id`}
                        render={({ field, fieldState }) => (
                            <Field className='w-full'>
                                <FieldInput {...field} placeholder="Chave (Ex: Cor)" />
                                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                        )}
                    />
                    <Controller
                        control={control}
                        name={`specifications[${groupIndex}].attributes[${attrIndex}].text`}
                        render={({ field, fieldState }) => (
                            <Field className='w-full'>
                                <FieldInput {...field} placeholder="Valor (Ex: Preto)" />
                                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                        )}
                    />
                    <Button type="button" onClick={() => removeAttr(attrIndex)} variant="secondary" className="p-2 h-10">
                        Remover
                    </Button>
                </div>
            ))}
            {attributeFields.length < 15 && (
                <Button type="button" onClick={() => appendAttr({ id: '', text: '' } as Attribute)} variant="primary" className='mt-2 mx-auto py-2 px-4'>
                    + Adicionar Campo
                </Button>
            )}
        </div>
    );
};