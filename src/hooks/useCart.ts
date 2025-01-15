import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'
import type { Shoes, CartItem } from '../types'

export const useCart = () => {

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
    
      const [data] = useState(db)
      const [cart, setCart] = useState(initialCart)
    
      const MIN_ITEMS = 1
      const MAX_ITEMS = 5
    
      useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
      }, [cart])
    
      function addToCart(item : Shoes) {
        const itemExists = cart.findIndex(shoes => shoes.id === item.id)
        if(itemExists >= 0 ) { // existe en el carrito
          if(cart[itemExists].quantity >= MAX_ITEMS) return
          const updatedCart = [...cart]
          updatedCart[itemExists].quantity++
          setCart(updatedCart)
        } else {
          const newItem : CartItem = {...item, quantity : 1}
          setCart([...cart, newItem])
        }
      }
    
      function removeFromCart(id : Shoes['id']) {
        setCart(prevCart => prevCart.filter(shoes => shoes.id !== id))
      }
    
      function decreaseQuantity(id : Shoes['id']) {
        const updatedCart = cart.map( item => {
          if(item.id === id && item.quantity > MIN_ITEMS) {
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function increaseQuantity(id : Shoes['id']) {
        const updatedCart = cart.map( item => {
          if(item.id === id && item.quantity < MAX_ITEMS) {
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function clearCart() {
        setCart([])
      }

      // State Derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart])
    const cartTotal = useMemo( () => cart.reduce( (total, item ) => total + (item.quantity * item.price), 0), [cart] )

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}