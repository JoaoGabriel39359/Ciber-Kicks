import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMeusPedidos } from '../../services/api';

interface ItemPedido {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    produtos?: {
        nome: string;
        imagem_url: string;
    };
}

interface Pedido {
    id: string;
    created_at: string;
    status: string;
    valor_total: number;
    itens_pedido: ItemPedido[];
}

export function OrdersScreen({ navigation }: any) {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    async function carregarPedidos() {
        try {
            setLoading(true);
            const data = await getMeusPedidos();
            setPedidos(data);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarPedidos();
    }, []);

    const renderPedidoItem = ({ item }: { item: Pedido }) => {
        const dataFormatada = new Date(item.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.orderId}>Pedido #{item.id.slice(0, 8)}</Text>
                        <Text style={styles.orderDate}>{dataFormatada}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{item.status || 'Concluído'}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Resumo dos itens do pedido */}
                {item.itens_pedido?.map((itemProd, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemQuantity}>{itemProd.quantidade}x</Text>
                        <Text style={styles.itemName} numberOfLines={1}>
                            {itemProd.produtos?.nome || `Produto ${itemProd.produto_id.slice(0, 5)}...`}
                        </Text>
                        <Text style={styles.itemPrice}>
                            R$ {(itemProd.preco_unitario * itemProd.quantidade).toFixed(2)}
                        </Text>
                    </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>R$ {Number(item.valor_total).toFixed(2)}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#00F0FF" />
                </TouchableOpacity>
                <Text style={styles.title}>Meus Pedidos</Text>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00F0FF" />
                </View>
            ) : pedidos.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="receipt-outline" size={64} color="#333344" />
                    <Text style={styles.emptyText}>Você ainda não possui pedidos.</Text>
                </View>
            ) : (
                <FlatList
                    data={pedidos}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPedidoItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050508',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#888899',
        fontSize: 16,
        marginTop: 12,
    },
    listContainer: {
        padding: 20,
    },
    card: {
        backgroundColor: '#0D0D14',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    orderDate: {
        color: '#666677',
        fontSize: 12,
        marginTop: 2,
    },
    statusBadge: {
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00F0FF',
    },
    statusText: {
        color: '#00F0FF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemQuantity: {
        color: '#00F0FF',
        fontWeight: 'bold',
        marginRight: 8,
        fontSize: 14,
    },
    itemName: {
        color: '#CCCCCC',
        flex: 1,
        fontSize: 14,
    },
    itemPrice: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        color: '#888899',
        fontSize: 14,
    },
    totalValue: {
        color: '#00F0FF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});