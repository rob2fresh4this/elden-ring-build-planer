import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SaveBuildModal({ isOpen, setIsOpen, onSave, equippedWeapons = [], initialData = {} }) {
    const [buildName, setBuildName] = useState('');
    const [buildType, setBuildType] = useState('');
    const [description, setDescription] = useState('');
    const [favoriteWeapon, setFavoriteWeapon] = useState('');

    // Load initial data when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            setBuildName(initialData.buildName || '');
            setBuildType(initialData.buildType || '');
            setDescription(initialData.description || '');
            setFavoriteWeapon(initialData.favoriteWeapon || '');
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        if (!buildName.trim()) {
            toast.error('Please enter a build name.');
            return;
        }

        const modalData = {
            buildName: buildName.trim(),
            buildType,
            description: description.trim(),
            favoriteWeapon
        };

        onSave(modalData);
        setIsOpen(false);
        
        // Reset form
        setBuildName('');
        setBuildType('');
        setDescription('');
        setFavoriteWeapon('');
    };

    const handleClose = () => {
        setIsOpen(false);
        // Reset form
        setBuildName('');
        setBuildType('');
        setDescription('');
        setFavoriteWeapon('');
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#2d2212] border-2 border-[#e5c77b]/20 text-[#e5c77b] p-6 shadow-xl transition-all">
                                <Dialog.Title className="text-lg font-semibold text-[#e5c77b] mb-4">Save Your Build</Dialog.Title>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#c0a857] mb-1">Build Name *</label>
                                        <input
                                            type="text"
                                            value={buildName}
                                            onChange={(e) => setBuildName(e.target.value)}
                                            className="w-full rounded-lg bg-[#19140e] border border-[#c0a857] px-3 py-2 text-sm text-[#e5c77b] focus:outline-none focus:ring-2 focus:ring-[#e5c77b]"
                                            placeholder="Enter build name..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#c0a857] mb-1">Build Type</label>
                                        <div className="flex gap-4">
                                            {['PvP', 'PvE', 'Both'].map((type) => (
                                                <label key={type} className="inline-flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="buildType"
                                                        value={type}
                                                        checked={buildType === type}
                                                        onChange={(e) => setBuildType(e.target.value)}
                                                        className="text-[#e5c77b] focus:ring-[#e5c77b]"
                                                    />
                                                    <span className="text-sm text-[#e5c77b]">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#c0a857] mb-1">Favorite Weapon</label>
                                        <select
                                            value={favoriteWeapon}
                                            onChange={(e) => setFavoriteWeapon(e.target.value)}
                                            className="w-full rounded-lg bg-[#19140e] border border-[#c0a857] px-3 py-2 text-sm text-[#e5c77b] focus:outline-none focus:ring-2 focus:ring-[#e5c77b]"
                                        >
                                            <option value="">Select a weapon...</option>
                                            {equippedWeapons.map((weapon, index) => (
                                                <option key={index} value={weapon.name}>
                                                    {weapon.name}{weapon.infusion ? ` (${weapon.infusion})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {equippedWeapons.length === 0 && (
                                            <p className="text-xs text-[#c0a857] mt-1">No weapons equipped</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#c0a857] mb-1">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={3}
                                            className="w-full rounded-lg bg-[#19140e] border border-[#c0a857] px-3 py-2 text-sm text-[#e5c77b] resize-none focus:outline-none focus:ring-2 focus:ring-[#e5c77b]"
                                            placeholder="Describe your build strategy..."
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg bg-[#e5c77b] text-[#19140e] text-sm font-semibold hover:bg-[#c0a857] transition-colors duration-200"
                                    >
                                        Save Build
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
