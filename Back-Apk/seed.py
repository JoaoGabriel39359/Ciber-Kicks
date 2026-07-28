import os
import urllib.request
import json

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Supabase environment variables not found in .env")
    exit(1)

new_products = [
    {
        "nome": "ASICS Gel-Kayano 14 JJJJound White",
        "marca": "ASICS",
        "categoria": "Casual",
        "preco": 2499.00,
        "imagem": [
            "https://images.stockx.com/360/ASICS-Gel-Kayano-14-JJJJound-White/Images/ASICS-Gel-Kayano-14-JJJJound-White/Lv2/img01.jpg",
            "https://images.stockx.com/360/ASICS-Gel-Kayano-14-JJJJound-White/Images/ASICS-Gel-Kayano-14-JJJJound-White/Lv2/img10.jpg",
            "https://images.stockx.com/360/ASICS-Gel-Kayano-14-JJJJound-White/Images/ASICS-Gel-Kayano-14-JJJJound-White/Lv2/img19.jpg"
        ],
        "descricao": "Extremely valued minimalist collaboration between ASICS and JJJJound."
    },
    {
        "nome": "ASICS Gel-1130 HAL Studios Forest",
        "marca": "ASICS",
        "categoria": "Casual",
        "preco": 1899.00,
        "imagem": [
            "https://images.stockx.com/360/ASICS-GEL-1130-HAL-Studios-Forest/Images/ASICS-GEL-1130-HAL-Studios-Forest/Lv2/img01.jpg",
            "https://images.stockx.com/360/ASICS-GEL-1130-HAL-Studios-Forest/Images/ASICS-GEL-1130-HAL-Studios-Forest/Lv2/img10.jpg",
            "https://images.stockx.com/360/ASICS-GEL-1130-HAL-Studios-Forest/Images/ASICS-GEL-1130-HAL-Studios-Forest/Lv2/img19.jpg"
        ],
        "descricao": "Limited partnership that became a benchmark in the techwear segment."
    },
    {
        "nome": "Nike Air Max 1 Patta Monarch",
        "marca": "Nike",
        "categoria": "Casual",
        "preco": 1899.00,
        "imagem": [
            "https://images.stockx.com/360/Nike-Air-Max-1-Patta-Monarch/Images/Nike-Air-Max-1-Patta-Monarch/Lv2/img01.jpg",
            "https://images.stockx.com/360/Nike-Air-Max-1-Patta-Monarch/Images/Nike-Air-Max-1-Patta-Monarch/Lv2/img10.jpg",
            "https://images.stockx.com/360/Nike-Air-Max-1-Patta-Monarch/Images/Nike-Air-Max-1-Patta-Monarch/Lv2/img19.jpg"
        ],
        "descricao": "The Patta Wave collaboration became a modern classic."
    },
    {
        "nome": "Nike Air Max 95 Corteiz Pink Beam",
        "marca": "Nike",
        "categoria": "Casual",
        "preco": 3199.00,
        "imagem": [
            "https://images.stockx.com/360/Nike-Air-Max-95-Corteiz-Pink-Beam/Images/Nike-Air-Max-95-Corteiz-Pink-Beam/Lv2/img01.jpg",
            "https://images.stockx.com/360/Nike-Air-Max-95-Corteiz-Pink-Beam/Images/Nike-Air-Max-95-Corteiz-Pink-Beam/Lv2/img10.jpg",
            "https://images.stockx.com/360/Nike-Air-Max-95-Corteiz-Pink-Beam/Images/Nike-Air-Max-95-Corteiz-Pink-Beam/Lv2/img19.jpg"
        ],
        "descricao": "One of the most hyped collaborations between Corteiz and Nike."
    },
    {
        "nome": "Maison Margiela Replica GAT White",
        "marca": "Maison Margiela",
        "categoria": "Luxury",
        "preco": 4299.00,
        "imagem": [
            "https://images.stockx.com/360/Maison-Margiela-Replica-GAT-White/Images/Maison-Margiela-Replica-GAT-White/Lv2/img01.jpg",
            "https://images.stockx.com/360/Maison-Margiela-Replica-GAT-White/Images/Maison-Margiela-Replica-GAT-White/Lv2/img10.jpg",
            "https://images.stockx.com/360/Maison-Margiela-Replica-GAT-White/Images/Maison-Margiela-Replica-GAT-White/Lv2/img19.jpg"
        ],
        "descricao": "The classic Replica GAT is one of the most worn luxury sneakers today."
    },
    {
        "nome": "Rick Owens DRKSHDW Ramones Low Black",
        "marca": "Rick Owens",
        "categoria": "Luxury",
        "preco": 5599.00,
        "imagem": [
            "https://images.stockx.com/360/Rick-Owens-DRKSHDW-Ramones-Low-Black/Images/Rick-Owens-DRKSHDW-Ramones-Low-Black/Lv2/img01.jpg",
            "https://images.stockx.com/360/Rick-Owens-DRKSHDW-Ramones-Low-Black/Images/Rick-Owens-DRKSHDW-Ramones-Low-Black/Lv2/img10.jpg",
            "https://images.stockx.com/360/Rick-Owens-DRKSHDW-Ramones-Low-Black/Images/Rick-Owens-DRKSHDW-Ramones-Low-Black/Lv2/img19.jpg"
        ],
        "descricao": "Icon of luxury streetwear with an unmistakable design."
    },
    {
        "nome": "Off-White Out Of Office White Green",
        "marca": "Off-White",
        "categoria": "Luxury",
        "preco": 4599.00,
        "imagem": [
            "https://images.stockx.com/360/Off-White-Out-Of-Office-White-Green/Images/Off-White-Out-Of-Office-White-Green/Lv2/img01.jpg",
            "https://images.stockx.com/360/Off-White-Out-Of-Office-White-Green/Images/Off-White-Out-Of-Office-White-Green/Lv2/img10.jpg",
            "https://images.stockx.com/360/Off-White-Out-Of-Office-White-Green/Images/Off-White-Out-Of-Office-White-Green/Lv2/img19.jpg"
        ],
        "descricao": "Out Of Office model created by Virgil Abloh with premium finish."
    },
    {
        "nome": "Gucci Rhyton Ivory",
        "marca": "Gucci",
        "categoria": "Luxury",
        "preco": 6899.00,
        "imagem": [
            "https://images.stockx.com/360/Gucci-Rhyton-Ivory/Images/Gucci-Rhyton-Ivory/Lv2/img01.jpg",
            "https://images.stockx.com/360/Gucci-Rhyton-Ivory/Images/Gucci-Rhyton-Ivory/Lv2/img10.jpg",
            "https://images.stockx.com/360/Gucci-Rhyton-Ivory/Images/Gucci-Rhyton-Ivory/Lv2/img19.jpg"
        ],
        "descricao": "Luxury sneaker with robust design and premium leather finish."
    },
    {
        "nome": "Alexander McQueen Oversized White Black",
        "marca": "Alexander McQueen",
        "categoria": "Luxury",
        "preco": 3999.00,
        "imagem": [
            "https://images.stockx.com/360/Alexander-McQueen-Oversized-White-Black/Images/Alexander-McQueen-Oversized-White-Black/Lv2/img01.jpg",
            "https://images.stockx.com/360/Alexander-McQueen-Oversized-White-Black/Images/Alexander-McQueen-Oversized-White-Black/Lv2/img10.jpg",
            "https://images.stockx.com/360/Alexander-McQueen-Oversized-White-Black/Images/Alexander-McQueen-Oversized-White-Black/Lv2/img19.jpg"
        ],
        "descricao": "One of the best-selling luxury sneakers in the world thanks to its minimalist design."
    }
]

def add_new_products():
    endpoint = f"{SUPABASE_URL.rstrip('/')}/rest/v1/produtos"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    print(f"📡 Sending {len(new_products)} products...")
    data = json.dumps(new_products).encode('utf-8')
    req_post = urllib.request.Request(endpoint, data=data, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req_post) as response:
            if response.status in [200, 201]:
                print("🚀 SUCCESS! All products were updated successfully!")
            else:
                print(f"Returned status: {response.status}")
    except urllib.error.HTTPError as e:
        details = e.read().decode('utf-8')
        print(f"❌ HTTP Error {e.code}: {e.reason}\n🔍 {details}")
    except Exception as e:
        print(f"❌ Error sending products: {e}")

if __name__ == "__main__":
    add_new_products()