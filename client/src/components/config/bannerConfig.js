// src/config/bannerConfig.js

const banners = {
    flashSale: [
        { id: 1, image: "/assets/image-banner/flash-sale-1.png", productId: 101 },
        { id: 2, image: "/assets/image-banner/flash-sale-2.png", productId: 102 }
    ],
    newArrival: [
        { id: 3, image: "/assets/image-banner/new-arrival-1.png", productId: 201 },
        { id: 4, image: "/assets/image-banner/new-arrival-2.png", productId: 202 }
    ],
    whey: [
        { id: 5, image: "/assets/image-banner/whey-1.png", productId: 301 },
        { id: 6, image: "/assets/image-banner/whey-2.png", productId: 302 }
    ],
    gainer: [
        { id: 7, image: "/assets/image-banner/gainer-1.png", productId: 401 },
        { id: 8, image: "/assets/image-banner/gainer-2.png", productId: 402 }
    ],
    recovery: [
        { id: 9, image: "/assets/image-banner/recovery-1.png", productId: 501 },
        { id: 10, image: "/assets/image-banner/recovery-2.png", productId: 502 }
    ],
    preWorkout: [
        { id: 11, image: "/assets/image-banner/pre-workout-1.png", productId: 601 },
        { id: 12, image: "/assets/image-banner/pre-workout-2.png", productId: 602 }
    ],
    creatine: [
        { id: 13, image: "/assets/image-banner/creatine-1.png", productId: 701 },
        { id: 14, image: "/assets/image-banner/creatine-2.png", productId: 702 }
    ],
    fatBurner: [
        { id: 15, image: "/assets/image-banner/fat-burner-1.png", productId: 801 },
        { id: 16, image: "/assets/image-banner/fat-burner-2.png", productId: 802 }
    ],
    fishOil: [
        { id: 17, image: "/assets/image-banner/fish-oil-1.png", productId: 901 },
        { id: 18, image: "/assets/image-banner/fish-oil-2.png", productId: 902 }
    ],
    multivitamin: [
        { id: 19, image: "/assets/image-banner/multivitamin-1.png", productId: 1001 },
        { id: 20, image: "/assets/image-banner/multivitamin-2.png", productId: 1002 }
    ],
    d3k2: [
        { id: 21, image: "/assets/image-banner/d3k2-1.png", productId: 1101 },
        { id: 22, image: "/assets/image-banner/d3k2-2.png", productId: 1102 }
    ],
    minerals: [
        { id: 23, image: "/assets/image-banner/minerals-1.png", productId: 1201 },
        { id: 24, image: "/assets/image-banner/minerals-2.png", productId: 1202 }
    ],
    liverSupport: [
        { id: 25, image: "/assets/image-banner/liver-support-1.png", productId: 1301 },
        { id: 26, image: "/assets/image-banner/liver-support-2.png", productId: 1302 }
    ],
    testosterone: [
        { id: 27, image: "/assets/image-banner/testosterone-1.png", productId: 1401 },
        { id: 28, image: "/assets/image-banner/testosterone-2.png", productId: 1402 }
    ],
    jointSupport: [
        { id: 29, image: "/assets/image-banner/joint-support-1.png", productId: 1501 },
        { id: 30, image: "/assets/image-banner/joint-support-2.png", productId: 1502 }
    ]
};

export const getBannerKey = (name, id) => {
    if (!name) return 'flashSale';

    const lowerName = name.toLowerCase().trim();

    if (lowerName.includes('flash') || lowerName.includes('sale') || lowerName.includes('khuyến mãi')) return 'flashSale';
    if (lowerName.includes('mới') || lowerName.includes('new') || lowerName.includes('arrival')) return 'newArrival';
    if (lowerName.includes('d3') || lowerName.includes('k2') || lowerName.includes('canxi')) return 'd3k2';
    if (lowerName.includes('fish') || lowerName.includes('dầu cá') || lowerName.includes('omega')
        || lowerName.includes('dha') || lowerName.includes('epa')) return 'fishOil';
    if (lowerName.includes('creatine')) return 'creatine';
    if (lowerName.includes('bổ sung')) return 'gainer';
    if (lowerName.includes('phụ kiện')) return 'testosterone';
    if (lowerName.includes('pre') && lowerName.includes('workout')) return 'preWorkout';
    if (lowerName.includes('tỉnh táo') || lowerName.includes('năng lượng')) return 'preWorkout';
    if (lowerName.includes('whey') || lowerName.includes('protein') || lowerName.includes('đạm') || lowerName.includes('tăng cơ')) return 'whey';
    if (lowerName.includes('gainer') || lowerName.includes('mass') || lowerName.includes('tăng cân')) return 'gainer';
    if (lowerName.includes('fat') || lowerName.includes('burn') || lowerName.includes('đốt mỡ') || lowerName.includes('giảm cân') || lowerName.includes('giảm mỡ')
        || lowerName.includes('carnitine')) return 'fatBurner';
    if (lowerName.includes('recovery') || lowerName.includes('phục hồi') || lowerName.includes('bcaa') || lowerName.includes('eaa')
        || lowerName.includes('glutamine') || lowerName.includes('nhức mỏi')) return 'recovery';
    if (lowerName.includes('test') || lowerName.includes('nam giới') || lowerName.includes('sinh lý')) return 'testosterone';
    if (lowerName.includes('joint') || lowerName.includes('khớp') || lowerName.includes('xương')
        || lowerName.includes('sụn') || lowerName.includes('glucosamine')) return 'jointSupport';
    if (lowerName.includes('liver') || lowerName.includes('gan') || lowerName.includes('thải độc') || lowerName.includes('giải độc')) return 'liverSupport';
    if (lowerName.includes('mineral') || lowerName.includes('khoáng') || lowerName.includes('kẽm') || lowerName.includes('zinc')
        || lowerName.includes('magnesium') || lowerName.includes('magie') || lowerName.includes('sắt')) return 'minerals';
    if (lowerName.includes('vitamin') || lowerName.includes('đa khoáng')) return 'multivitamin';
    if (lowerName.includes('sức mạnh') || lowerName.includes('strength')) return 'preWorkout';
    if (lowerName.includes('bền') || lowerName.includes('endurance')) return 'preWorkout';

    return 'flashSale';
};

export default banners;