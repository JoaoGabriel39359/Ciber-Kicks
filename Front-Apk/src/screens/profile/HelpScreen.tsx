import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Linking,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FAQItem {
    id: string;
    pergunta: string;
    resposta: string;
}

const FAQ_LISTA: FAQItem[] = [
    {
        id: '1',
        pergunta: 'COMO GARANTO A AUTENTICIDADE DOS DROPS?',
        resposta: 'Todos os sneakers passam por uma verificação física e digital rigorosa do nosso laboratório SNKRS LAB antes de serem enviados. Acompanha selo NFC de autenticidade no produto.',
    },
    {
        id: '2',
        pergunta: 'QUAL O PRAZO DE ENTREGA DOS PRODUTOS?',
        resposta: 'O envio Expresso Cyber leva de 2 a 5 dias úteis para capitais e regiões metropolitanas. Para demais localidades, o prazo varia entre 5 e 9 dias úteis.',
    },
    {
        id: '3',
        pergunta: 'COMO FUNCIONA A POLÍTICA DE TROCAS E DEVOLUÇÕES?',
        resposta: 'Você pode solicitar a troca ou devolução gratuita em até 7 dias corridos após o recebimento. O tênis deve estar na caixa original, sem marcas de uso e com as lacres intactos.',
    },
    {
        id: '4',
        pergunta: 'QUAIS SÃO AS FORMAS DE PAGAMENTO ACEITAS?',
        resposta: 'Aceitamos PIX (com 5% de desconto automático), cartões de crédito em até 12x sem juros (Visa, Mastercard, Elo) e saldo da conta Cyber.',
    },
];

export function HelpScreen({ navigation }: any) {
    const [faqAberto, setFaqAberto] = useState<string | null>(null);

    const toggleFaq = (id: string) => {
        setFaqAberto(faqAberto === id ? null : id);
    };

    const handleContatoWhatsApp = () => {
        const mensagem = encodeURIComponent('Olá, preciso de suporte com meu pedido na CyberKicks!');
        const url = `https://wa.me/5511999999999?text=${mensagem}`;

        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Erro', 'Não foi possível abrir o WhatsApp no seu dispositivo.');
            }
        });
    };

    const handleContatoEmail = () => {
        const url = 'mailto:suporte@cyberkicks.com.br?subject=Suporte%20CyberKicks';
        Linking.openURL(url);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>SUPORTE & AJUDA</Text>
                <View style={styles.espacadorHeader} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Banner Suporte VIP */}
                <View style={styles.cardBanner}>
                    <View style={styles.iconBannerBg}>
                        <Ionicons name="headset" size={24} color="#00F0FF" />
                    </View>

                    <View style={styles.contentBanner}>
                        <Text style={styles.tituloBanner}>ATENDIMENTO CYBER 24/7</Text>
                        <Text style={styles.subBanner}>
                            Precisa de ajuda com uma compra ou rastreamento? Nossa equipe responde rápido.
                        </Text>
                    </View>
                </View>

                {/* Canais de Contato Direto */}
                <Text style={styles.secaoTitulo}>CANAIS DE ATENDIMENTO</Text>

                <View style={styles.canaisRow}>
                    <TouchableOpacity
                        style={styles.cardCanal}
                        activeOpacity={0.8}
                        onPress={handleContatoWhatsApp}
                    >
                        <View style={[styles.iconCanal, { backgroundColor: 'rgba(0, 230, 118, 0.1)' }]}>
                            <Ionicons name="logo-whatsapp" size={20} color="#00E676" />
                        </View>
                        <Text style={styles.nomeCanal}>WHATSAPP</Text>
                        <Text style={styles.statusCanal}>Online agora</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cardCanal}
                        activeOpacity={0.8}
                        onPress={handleContatoEmail}
                    >
                        <View style={[styles.iconCanal, { backgroundColor: 'rgba(0, 240, 255, 0.1)' }]}>
                            <Ionicons name="mail" size={20} color="#00F0FF" />
                        </View>
                        <Text style={styles.nomeCanal}>E-MAIL</Text>
                        <Text style={styles.statusCanal}>Resposta em 2h</Text>
                    </TouchableOpacity>
                </View>

                {/* Dúvidas Frequentes (FAQ) */}
                <Text style={styles.secaoTitulo}>DÚVIDAS FREQUENTES (FAQ)</Text>

                <View style={styles.faqContainer}>
                    {FAQ_LISTA.map((item) => {
                        const estaAberto = faqAberto === item.id;
                        return (
                            <View key={item.id} style={styles.faqCard}>
                                <TouchableOpacity
                                    style={styles.faqHeader}
                                    activeOpacity={0.7}
                                    onPress={() => toggleFaq(item.id)}
                                >
                                    <Text style={styles.faqPergunta}>{item.pergunta}</Text>
                                    <Ionicons
                                        name={estaAberto ? 'chevron-up' : 'chevron-down'}
                                        size={18}
                                        color={estaAberto ? '#00F0FF' : '#666677'}
                                    />
                                </TouchableOpacity>

                                {estaAberto && (
                                    <View style={styles.faqContent}>
                                        <Text style={styles.faqResposta}>{item.resposta}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
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

    cardBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F16',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 240, 255, 0.2)',
        gap: 14,
    },
    iconBannerBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentBanner: { flex: 1 },
    tituloBanner: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
    subBanner: { color: '#888899', fontSize: 11, marginTop: 4, lineHeight: 16 },

    secaoTitulo: { color: '#666677', fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12 },

    canaisRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    cardCanal: {
        flex: 1,
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconCanal: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    nomeCanal: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    statusCanal: { color: '#666677', fontSize: 9, fontWeight: '700', marginTop: 2 },

    faqContainer: { gap: 10, marginBottom: 20 },
    faqCard: {
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqPergunta: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, flex: 1, marginRight: 10 },
    faqContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.04)',
        paddingTop: 12,
    },
    faqResposta: { color: '#888899', fontSize: 12, lineHeight: 18 },
});