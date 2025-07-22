  // DOM Elements
        const themeBtn = document.getElementById('theme-btn');
        const helpBtn = document.getElementById('help-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const soundToggleBtn = document.getElementById('sound-toggle');
        const reminderBtn = document.getElementById('reminder-btn');
        const shareBtn = document.getElementById('share-btn');
        const themeModal = document.getElementById('theme-modal');
        const helpModal = document.getElementById('help-modal');
        const settingsModal = document.getElementById('settings-modal');
        const reminderModal = document.getElementById('reminder-modal');
        const shareModal = document.getElementById('share-modal');
        const deleteModal = document.getElementById('delete-modal');
        const editModal = document.getElementById('edit-modal');
        const reminderNotification = document.getElementById('reminder-notification');
        const closeThemeModal = document.getElementById('close-theme-modal');
        const closeHelpModal = document.getElementById('close-help-modal');
        const closeSettingsModal = document.getElementById('close-settings-modal');
        const closeReminderModal = document.getElementById('close-reminder-modal');
        const closeShareModal = document.getElementById('close-share-modal');
        const closeDeleteModal = document.getElementById('close-delete-modal');
        const closeEditModal = document.getElementById('close-edit-modal');
        const closeReminderNotification = document.getElementById('close-reminder-notification');
        const soundToggleSwitch = document.getElementById('sound-toggle-switch');
        const countdownForm = document.getElementById('countdown-form');
        const reminderForm = document.getElementById('reminder-form');
        const editForm = document.getElementById('edit-form');
        const countdownList = document.getElementById('countdown-list');
        const activeTitle = document.getElementById('active-title');
        const totalCountEl = document.getElementById('total-count');
        const activeCountEl = document.getElementById('active-count');
        const completedCountEl = document.getElementById('completed-count');
        const cancelDeleteBtn = document.getElementById('cancel-delete');
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        const okReminderBtn = document.getElementById('ok-reminder-btn');
        const notificationSound = document.getElementById('notification-sound');
        const expiredMessage = document.getElementById('expired-message');
        const countdownDisplay = document.getElementById('countdown-display');
        const reminderNotificationText = document.getElementById('reminder-notification-text');
 
        let countdowns = [
            { id: '1', title: "new year", date: "2025-01-01", category: "holiday" },
            { id: '2', title: "Project Deadline", date: "2024-04-30", category: "work" },
            { id: '3', title: "Final Exams", date: "2024-05-15", category: "education" }
           
        ];

        let activeCountdownId = localStorage.getItem('activeCountdownId') || countdowns[countdowns.length - 1].id;
        let reminders = [];
        let selectedTheme = 'default';
        let countdownToDelete = null;
        let countdownToEdit = null;

        const categoryColors = {
            personal: '#4895ef',
            work: '#4cc9f0',
            holiday: '#ff9e00',
            education: '#9d4edd',
            other: '#f72585'
        };

    
        function saveCountdowns() {
            localStorage.setItem('countdowns', JSON.stringify(countdowns));
        }

        function saveActiveCountdown(id) {
            activeCountdownId = id;
            localStorage.setItem('activeCountdownId', id);
        }


    
        function getActiveCountdown() {
            return localStorage.getItem('activeCountdownId');
        }

        function initModals() {
            
            themeBtn.addEventListener('click', () => {
                themeModal.classList.add('active');
            });
            
            closeThemeModal.addEventListener('click', () => {
                themeModal.classList.remove('active');
            });
            

            helpBtn.addEventListener('click', () => {
                helpModal.classList.add('active');
            });
            
            closeHelpModal.addEventListener('click', () => {
                helpModal.classList.remove('active');
            });
        
            settingsBtn.addEventListener('click', () => {
                settingsModal.classList.add('active');
            });
            
            closeSettingsModal.addEventListener('click', () => {
                settingsModal.classList.remove('active');
            });
            
            reminderBtn.addEventListener('click', () => {
                if (!activeCountdownId) {
                    playNotificationSound();
                    showReminderNotification('Please select a countdown first');
                    return;
                }
                reminderModal.classList.add('active');
            });
            
            closeReminderModal.addEventListener('click', () => {
                reminderModal.classList.remove('active');
            });
            
        
            shareBtn.addEventListener('click', () => {
                if (!activeCountdownId) {
                    playNotificationSound();
                    showReminderNotification('Please select a countdown first');
                    return;
                }
                shareModal.classList.add('active');
            });
            
            closeShareModal.addEventListener('click', () => {
                shareModal.classList.remove('active');
            });
            
            closeDeleteModal.addEventListener('click', () => {
                deleteModal.classList.remove('active');
            });
            
            cancelDeleteBtn.addEventListener('click', () => {
                deleteModal.classList.remove('active');
            });
            
            confirmDeleteBtn.addEventListener('click', () => {
                if (countdownToDelete) {
                    deleteCountdown(countdownToDelete);
                    countdownToDelete = null;
                    deleteModal.classList.remove('active');
                }
            });
            
            closeEditModal.addEventListener('click', () => {
                editModal.classList.remove('active');
            });
            
            closeReminderNotification.addEventListener('click', () => {
                reminderNotification.classList.remove('active');
            });
            
            okReminderBtn.addEventListener('click', () => {
                reminderNotification.classList.remove('active');
            });
            
            document.querySelectorAll('.theme-option').forEach(option => {
                option.addEventListener('click', () => {
                    selectedTheme = option.dataset.theme;
                    document.body.className = `theme-${selectedTheme}`;
                    
            
                    document.querySelectorAll('.theme-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                    
                    playNotificationSound();
                });
            });
    
            document.querySelectorAll('.reminder-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.reminder-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                });
            });
            
            // Share
            document.querySelectorAll('.share-option').forEach(option => {
                option.addEventListener('click', () => {
                    shareCountdown(option.dataset.platform);
                });
            });
            
            // Sound Toggle
            soundToggleBtn.addEventListener('click', () => {
                soundToggleSwitch.checked = !soundToggleSwitch.checked;
                updateSoundToggleText();
                playNotificationSound();
            });
            
            soundToggleSwitch.addEventListener('change', updateSoundToggleText);
        }

        function showReminderNotification(message) {
            reminderNotificationText.textContent = message;
            reminderNotification.classList.add('active');
        }

        function playNotificationSound() {
            if (soundToggleSwitch.checked) {
                notificationSound.currentTime = 0;
                notificationSound.play().catch(e => console.log("Sound play failed:", e));
            }
        }

        function updateSoundToggleText() {
            const isSoundOn = soundToggleSwitch.checked;
            soundToggleBtn.innerHTML = isSoundOn ? 
                '<i class="fas fa-volume-up"></i> Sound On' : 
                '<i class="fas fa-volume-mute"></i> Sound Off';
        }

        function simulateCountdown() {
            const secondsEl = document.getElementById('seconds');
            let seconds = 45;
            
            setInterval(() => {
                seconds--;
                if (seconds < 0) seconds = 59;
                secondsEl.textContent = seconds.toString().padStart(2, '0');
            }, 1000);
        }

        function setActiveCountdown(id) {
            activeCountdownId = id;
            saveActiveCountdown(id); 
            
            document.querySelectorAll('.countdown-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const countdown = countdowns.find(c => c.id === id);
            if (countdown) {
                document.querySelector(`.countdown-item[data-id="${id}"]`).classList.add('active');
                activeTitle.textContent = countdown.title;
                updateStats();
                playNotificationSound();
                
                checkExpiredStatus(countdown);
            }
        }

        function checkExpiredStatus(countdown) {
            const now = new Date();
            const eventDate = new Date(countdown.date);
            
            if (eventDate < now) {
                countdownDisplay.style.display = 'none';
                expiredMessage.style.display = 'block';
            } else {
                countdownDisplay.style.display = 'flex';
                expiredMessage.style.display = 'none';
            }
        }

        function editCountdown(id) {
            const countdown = countdowns.find(c => c.id === id);
            if (countdown) {
                countdownToEdit = countdown;
                
                document.getElementById('edit-title').value = countdown.title;
                document.getElementById('edit-date').value = countdown.date;
                document.getElementById('edit-category').value = countdown.category;
                

                editModal.classList.add('active');
            }
        }

        function saveEditedCountdown(e) {
            e.preventDefault();
            
            if (!countdownToEdit) return;
            
            const title = document.getElementById('edit-title').value;
            const date = document.getElementById('edit-date').value;
            const category = document.getElementById('edit-category').value;
            
            if (!title || !date) return;
            
            countdownToEdit.title = title;
            countdownToEdit.date = date;
            countdownToEdit.category = category;
            
            renderCountdownList();
            
            
            if (countdownToEdit.id === activeCountdownId) {
                activeTitle.textContent = countdownToEdit.title;
                checkExpiredStatus(countdownToEdit);
            }
            
            updateStats();
            playNotificationSound();
            editModal.classList.remove('active');
            countdownToEdit = null;
        }

        function deleteCountdown(id) {
            countdowns = countdowns.filter(c => c.id !== id);
            

            if (activeCountdownId === id) {

                localStorage.removeItem('activeCountdownId');
        
                activeCountdownId = countdowns[0]?.id || null;
                if (activeCountdownId) {
                    setActiveCountdown(activeCountdownId);
                } else {
                    activeTitle.textContent = "No active countdown";
                    countdownDisplay.style.display = 'flex';
                    expiredMessage.style.display = 'none';
                }
            }
            
            renderCountdownList();
            updateStats();
            playNotificationSound();
        }

        function showDeleteConfirmation(id) {
            countdownToDelete = id;
            deleteModal.classList.add('active');
        }

        function addCountdown(e) {
            e.preventDefault();
            
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const category = document.getElementById('category').value;
            
            if (!title || !date) return;
            
            const newCountdown = {
                id: Date.now().toString(),
                title,
                date,
                category
            };
            
            countdowns.unshift(newCountdown);
        
            countdownForm.reset();
            
            renderCountdownList();
            
        
            setActiveCountdown(newCountdown.id);
            updateStats();
            playNotificationSound();
        }

        function addReminder(e) {
            e.preventDefault();
            
            const title = document.getElementById('reminder-title').value;
            const selectedOption = document.querySelector('.reminder-option.active');
            
            if (!title || !selectedOption) {
                playNotificationSound();
                showReminderNotification('Please fill all fields');
                return;
            }
            
            const daysBefore = parseInt(selectedOption.dataset.days);
            const countdown = countdowns.find(c => c.id === activeCountdownId);
            
            if (!countdown) return;
            
            const reminder = {
                id: Date.now().toString(),
                title,
                countdownId: activeCountdownId,
                countdownTitle: countdown.title,
                daysBefore,
                date: calculateReminderDate(countdown.date, daysBefore)
            };
            
            reminders.push(reminder);
            playNotificationSound();
            showReminderNotification(`Reminder set for ${daysBefore} day(s) before the event "${countdown.title}"!`);
            reminderForm.reset();
            reminderModal.classList.remove('active');
        }

        function calculateReminderDate(eventDate, daysBefore) {
            const date = new Date(eventDate);
            date.setDate(date.getDate() - daysBefore);
            return date.toISOString().split('T')[0];
        }

        function shareCountdown(platform) {
            if (!activeCountdownId) {
                playNotificationSound();
                showReminderNotification('Please select a countdown first');
                return;
            }
            
            const countdown = countdowns.find(c => c.id === activeCountdownId);
            if (!countdown) return;
            
            const shareText = `Countdown to ${countdown.title} on ${formatDate(countdown.date)} - Check it out!`;
            const shareUrl = window.location.href;
            
            playNotificationSound();
            
            switch(platform) {
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
                    break;
                case 'whatsapp':
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
                    break;
                case 'instagram':

                    copyToClipboard(shareText + '\n' + shareUrl);
                    showReminderNotification('Instagram sharing is not directly supported. The countdown info has been copied to your clipboard instead.');
                    break;
                case 'telegram':
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
                    break;
                case 'email':
                    window.open(`mailto:?subject=Countdown to ${encodeURIComponent(countdown.title)}&body=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
                    break;
                default:
                    copyToClipboard(shareText + '\n' + shareUrl);
                    showReminderNotification('Countdown info copied to clipboard!');
            }
            
            shareModal.classList.remove('active');
        }

        function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        }

        function updateStats() {
            totalCountEl.textContent = countdowns.length;
            activeCountEl.textContent = activeCountdownId ? 1 : 0;
            

            const now = new Date();
            const completed = countdowns.filter(c => new Date(c.date) < now).length;
            completedCountEl.textContent = completed;
        }

        function renderCountdownList() {
            if (countdowns.length === 0) {
                countdownList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-hourglass-start"></i>
                        <h3>No Countdowns Yet</h3>
                        <p>Add your first countdown to get started!</p>
                    </div>
                `;
                return;
            }

            countdownList.innerHTML = countdowns.map(countdown => {
                const categoryColor = categoryColors[countdown.category] || categoryColors.other;
                const isActive = countdown.id === activeCountdownId;
                const now = new Date();
                const eventDate = new Date(countdown.date);
                const isExpired = eventDate < now;
                
                return `
                    <div class="countdown-item ${isActive ? 'active' : ''} ${isExpired ? 'expired' : ''}" 
                         data-id="${countdown.id}" 
                         style="--category-color: ${categoryColor}">
                        <div class="item-info" onclick="setActiveCountdown('${countdown.id}')">
                            <div class="item-title">
                                <span>${countdown.title}</span>
                                <span class="item-category">${countdown.category.charAt(0).toUpperCase() + countdown.category.slice(1)}</span>
                            </div>
                            <div class="item-date">
                                <i class="far fa-calendar"></i>
                                ${formatDate(countdown.date)}
                                ${isExpired ? '<span class="item-expired">(Expired)</span>' : ''}
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="action-btn edit-btn" onclick="editCountdown('${countdown.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="showDeleteConfirmation('${countdown.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function init() {
            initModals();
            simulateCountdown();
            updateSoundToggleText();
            renderCountdownList();
            updateStats();
            

            countdownForm.addEventListener('submit', addCountdown);
            reminderForm.addEventListener('submit', addReminder);
            editForm.addEventListener('submit', saveEditedCountdown);
            
        
            const savedActiveId = getActiveCountdown();
            const savedCountdownExists = countdowns.some(c => c.id === savedActiveId);
            
            if (savedActiveId && savedCountdownExists) {
                setActiveCountdown(savedActiveId);
            } else if (countdowns.length > 0) {

                setActiveCountdown(countdowns[0].id);
            }
            

            document.querySelector('.reminder-option[data-days="1"]').classList.add('active');
        }

        document.addEventListener('DOMContentLoaded', init);
