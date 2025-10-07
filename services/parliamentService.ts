// This is a mock service to simulate fetching new parliamentary agendas.
// In a real-world scenario, this would be an API call to an external service.

interface NewAgenda {
    id: string;
    name: string;
    description: string;
}

const mockNewAgendas: NewAgenda[] = [
    {
        id: 'crypto-tax-bill-2568',
        name: 'พ.ร.บ. ภาษีสินทรัพย์ดิจิทัล ฉบับใหม่',
        description: 'เสนอการปรับปรุงโครงสร้างการเก็บภาษีกำไรจากการลงทุนในคริปโตเคอร์เรนซีและสินทรัพย์ดิจิทัล'
    },
    {
        id: 'clean-air-act-2568',
        name: 'ร่าง พ.ร.บ. อากาศสะอาดเพื่อประชาชน',
        description: 'เสนอกฎหมายแม่บทเพื่อจัดการปัญหามลพิษทางอากาศ โดยเฉพาะฝุ่น PM2.5 และมลพิษข้ามพรมแดน'
    }
];

export const fetchNewAgendas = (): Promise<NewAgenda[]> => {
    return new Promise((resolve) => {
        // Simulate a network delay of 1-2 seconds
        const delay = 1000 + Math.random() * 1000;
        setTimeout(() => {
            // In a real app, you might have logic to only return truly "new" agendas.
            // For this mock, we'll just return the list.
            resolve(mockNewAgendas);
        }, delay);
    });
};