import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import Button from '../Button/Button'

interface IModalProps{
    children: React.ReactNode
}

export default function Modal({children}:IModalProps) {
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">testte</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {children}
        </DialogContent>
    </Dialog>
  )
}
