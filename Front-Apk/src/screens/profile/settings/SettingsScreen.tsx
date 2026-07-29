import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function SettingsScreen({ navigation }: any) {
    const opcoesSettings = [
        {
            id: 'account',
            titulo: 'Dados da Conta',
            sub: 'E-mail, informações de perfil e exclusão',
            icone: 'person-outline',
            screen: 'AccountSettings',
        },
        {
            id: 'security',
            titulo: 'Segurança & Senha',
            sub: 'Alterar senha e autenticação',
            icone: 'lock-closed-outline',
            screen: 'SecuritySettings',
        },
        {
            id: 'notifications',
            titulo: 'Notificações & Push',
            sub: 'Drops exclusivos, cupons e avisos',
            icone: 'notifications-outline',
            screen: 'NotificationSettings',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>CONFIGURAÇÕES</Text>
                <View style={styles.espacadorHeader} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.menuGroup}>
                    {opcoesSettings.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate(item.screen)}
                        >
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
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050508' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    btnVoltar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0F0F16',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tituloHeader: { color: '#888899', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    espacadorHeader: { width: 40 },
    scroll: { padding: 20 },
    menuGroup: { gap: 12 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F16',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#050508',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTextContent: { flex: 1, marginLeft: 14 },
    menuTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
    menuSub: { color: '#666677', fontSize: 10, marginTop: 2 },
});