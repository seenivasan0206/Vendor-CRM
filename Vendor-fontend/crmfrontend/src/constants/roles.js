import { ShieldAlert, Briefcase, ShoppingBag } from 'lucide-react';

export const ROLES = [{
        id: 'ADMIN',
        label: 'Admin',
        icon: ShieldAlert,
        defaultEmail: 'admin@zenvezippy.com',
        description: 'System-wide control & settings',
    },
    {
        id: 'PROCUREMENT_MANAGER',
        label: 'Procurement Manager',
        icon: Briefcase,
        defaultEmail: 'manager@zenvezippy.com',
        description: 'Vendor vetting & contracts',
    },
    {
        id: 'PURCHASE_OFFICER',
        label: 'Purchase Officer',
        icon: ShoppingBag,
        defaultEmail: 'officer@zenvezippy.com',
        description: 'PO creation & tracking',
    },
];