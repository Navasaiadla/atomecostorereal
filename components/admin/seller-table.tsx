"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Store, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Seller {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

interface SellerTableProps {
  sellers: Seller[]
  onSellerUpdate: (sellerId: string, newRole: string) => Promise<void>
}

export function SellerTable({ sellers, onSellerUpdate }: SellerTableProps) {
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const getStatusBadge = (role: string) => {
    switch (role) {
      case 'seller':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'pending_seller':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'rejected_seller':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role}</Badge>
    }
  }

  const handleApprove = async (sellerId: string) => {
    setUpdatingIds(prev => new Set(prev).add(sellerId))
    try {
      await onSellerUpdate(sellerId, 'seller')
      toast({
        title: "Seller Approved",
        description: "The seller has been successfully approved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve seller. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(sellerId)
        return newSet
      })
    }
  }

  const handleReject = async (sellerId: string) => {
    setUpdatingIds(prev => new Set(prev).add(sellerId))
    try {
      await onSellerUpdate(sellerId, 'rejected_seller')
      toast({
        title: "Seller Rejected",
        description: "The seller has been rejected.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject seller. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(sellerId)
        return newSet
      })
    }
  }

  const isUpdating = (sellerId: string) => updatingIds.has(sellerId)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seller</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers.map((seller) => (
            <TableRow key={seller.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Store className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {seller.full_name || 'Unnamed Seller'}
                    </div>
                    <div className="text-sm text-gray-500">ID: {seller.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{seller.email}</TableCell>
              <TableCell>{getStatusBadge(seller.role)}</TableCell>
              <TableCell>
                {new Date(seller.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating(seller.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {seller.role === 'pending_seller' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(seller.id)}
                        disabled={isUpdating(seller.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(seller.id)}
                        disabled={isUpdating(seller.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
