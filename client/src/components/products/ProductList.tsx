import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  HStack,
  useToast,
  IconButton,
  Badge,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { ProductForm } from './ProductForm';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  unit: string;
  isActive: boolean;
}

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error('Fehler beim Laden der Produkte');
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Produkte konnten nicht geladen werden',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie dieses Produkt wirklich löschen?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3005/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
          toast({
            title: 'Erfolg',
            description: 'Produkt wurde gelöscht',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error('Fehler beim Löschen des Produkts');
        }
      } catch (error) {
        toast({
          title: 'Fehler',
          description: 'Produkt konnte nicht gelöscht werden',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSave = async (product: Omit<Product, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
      } else {
        throw new Error('Fehler beim Erstellen des Produkts');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (id: string, product: Omit<Product, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === id ? updatedProduct : p));
      } else {
        throw new Error('Fehler beim Aktualisieren des Produkts');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  return (
    <Card w="100%" borderRadius="0">
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="lg">Produktverwaltung</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleAdd}
          >
            Neues Produkt
          </Button>
        </HStack>
      </CardHeader>
      <CardBody p={0}>
        <Box overflowX="auto" w="100%">
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Beschreibung</Th>
                <Th>Kategorie</Th>
                <Th>Einheit</Th>
                <Th>Preis</Th>
                <Th>Status</Th>
                <Th>Aktionen</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>{product.name}</Td>
                  <Td>{product.description}</Td>
                  <Td>{product.category}</Td>
                  <Td>{product.unit}</Td>
                  <Td>{product.price.toFixed(2)} €</Td>
                  <Td>
                    <Badge colorScheme={product.isActive ? 'green' : 'red'}>
                      {product.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Bearbeiten"
                        icon={<FiEdit2 />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                      />
                      <IconButton
                        aria-label="Löschen"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={selectedProduct ? 
          (product) => handleUpdate(selectedProduct.id, product) : 
          handleSave}
        product={selectedProduct}
      />
    </Card>
  );
}; 