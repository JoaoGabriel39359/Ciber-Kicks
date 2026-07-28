import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ProfileScreen() {
    const opcoesMenu = [
        { id: 1, titulo: 'Meus Pedidos', sub: 'Histórico de compras e rastreamento', icone: 'cube-outline' },
        { id: 2, titulo: 'Endereços de Entrega', sub: 'Gerenciar locais de envio', icone: 'location-outline' },
        { id: 3, titulo: 'Formas de Pagamento', sub: 'Cartões e PIX salvos', icone: 'card-outline' },
        { id: 4, titulo: 'Configurações de Conta', sub: 'Segurança, senha e notificações', icone: 'settings-outline' },
        { id: 5, titulo: 'Suporte & Ajuda', sub: 'Fale conosco via chat ou e-mail', icone: 'help-circle-outline' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Profile Header */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>SN</Text>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>SNEAKERHEAD</Text>
                        <Text style={styles.userEmail}>membro.vip@snkrs.com</Text>
                        <View style={styles.badgeVip}>
                            <Text style={styles.textVip}>MEMBRO VIP SNKRS</Text>
                        </View>
                    </View>
                </View>

                {/* Profile Options */}
                <View style={styles.menuGroup}>
                    {opcoesMenu.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
                            <View style={styles.iconBox}>
                                <Ionicons name={item.icone as any} size={20} color="#00F0FF" />
                            </View>
                            <View style={styles.menuTextContent}>
                                <Text style={styles.menuTitle}>{item.titulo}</Text>
                                <Text style={styles.menuSub}>{item.sub}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#666677" />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.btnSair}>
                    <Text style={styles.textoBtnSair}>SAIR DA CONTA</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050508' },
    scroll: { padding: 20 },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F16',
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#00F0FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { color: '#000000', fontSize: 20, fontWeight: '900' },
    userDetails: { marginLeft: 16, flex: 1 },
    userName: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
    userEmail: { color: '#666677', fontSize: 11, marginTop: 2 },
    badgeVip: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginTop: 6,
    },
    textVip: { color: '#00F0FF', fontSize: 8, fontWeight: '900', letterSpacing: 1 },

    menuGroup: { gap: 10 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F16',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)',
    },
    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#050508',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTextContent: { flex: 1, marginLeft: 12 },
    menuTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
    menuSub: { color: '#666677', fontSize: 10, marginTop: 2 },

    btnSair: {
        marginTop: 24,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 59, 48, 0.2)',
    },
    textoBtnSair: { color: '#FF3B30', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
});