import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function NotificationSettingsScreen({ navigation }: any) {
    const [drops, setDrops] = useState(true);
    const [promos, setPromos] = useState(true);
    const [pedidos, setPedidos] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>NOTIFICAÇÕES</Text>
                <View style={styles.espacadorHeader} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.cardGroup}>
                    <View style={styles.rowSwitch}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.labelSwitch}>Drops & Lançamentos</Text>
                            <Text style={styles.subSwitch}>Avisos em tempo real sobre novos tênis</Text>
                        </View>
                        <Switch
                            value={drops}
                            onValueChange={setDrops}
                            trackColor={{ false: '#1A1A24', true: 'rgba(0, 240, 255, 0.4)' }}
                            thumbColor={drops ? '#00F0FF' : '#555566'}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.rowSwitch}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.labelSwitch}>Status de Pedidos</Text>
                            <Text style={styles.subSwitch}>Atualizações sobre envios e entrega</Text>
                        </View>
                        <Switch
                            value={pedidos}
                            onValueChange={setPedidos}
                            trackColor={{ false: '#1A1A24', true: 'rgba(0, 240, 255, 0.4)' }}
                            thumbColor={pedidos ? '#00F0FF' : '#555566'}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.rowSwitch}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.labelSwitch}>Cupons e Promoções VIP</Text>
                            <Text style={styles.subSwitch}>Ofertas exclusivas de membros</Text>
                        </View>
                        <Switch
                            value={promos}
                            onValueChange={setPromos}
                            trackColor={{ false: '#1A1A24', true: 'rgba(0, 240, 255, 0.4)' }}
                            thumbColor={promos ? '#00F0FF' : '#555566'}
                        />
                    </View>
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
    btnVoltar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0F0F16', justifyContent: 'center', alignItems: 'center' },
    tituloHeader: { color: '#888899', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    espacadorHeader: { width: 40 },
    scroll: { padding: 20 },
    cardGroup: {
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    rowSwitch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    labelSwitch: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
    subSwitch: { color: '#666677', fontSize: 10, marginTop: 2 },
    divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginVertical: 12 },
});