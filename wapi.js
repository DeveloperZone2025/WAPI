// From Live
const EVENT_NAME = "GOT_WAPI";
const MESSAGE_EVENT_NAME = "GOT_WAPI_SEND_MESSAGE";
const CAPTURE_PHONE_NUMBER_EVENT_NAME = "GOT_CAPTURE_PHONE_NUMBER";
const VALID_STATUS_PHONE_NUMBER_EVENT_NAME = "GOT_VALID_STATUS_PHONE_NUMBER";
const VALID_BEFORE_SENDING = "GOT_VALID_BEFORE_SENDING";
const GROUP_GRAB = "GOT_GROUP_GRAB";
const GROUP_GRAB_CONTACT = "GOT_GROUP_GRAB_CONTACT";
const TEMPLATE_MESSAGE = "GOT_TEMPLATE_MESSAGE";
const LIST_MESSAGE = "GOT_LIST_MESSAGE";
const VALID_AFTER_SENDING = "GOT_VALID_AFTER_SENDING";
console.log('running');

function prepareWindowStore() {
    try {
        if (!window.Store) {

            (function() {
                function getStore(modules) {
                    let foundCount = 0;
                    let neededObjects = [
                        { id: "Store", conditions: (module) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null },
                        { id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processAttachments) ? module.default : null },
                        { id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null },
                        { id: "Wap", conditions: (module) => (module.createGroup) ? module : null },
                        { id: 'FindChat', conditions: (module) => (module && module.findChat) ? module : null },
                        { id: "ServiceWorker", conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null },
                        { id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null },
                        { id: "WapDelete", conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
                        { id: "Conn", conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
                        { id: "WapQuery", conditions: (module) => (module.default && module.default.queryExist) ? module.default : null },
                        { id: "CryptoLib", conditions: (module) => (module.decryptE2EMedia) ? module : null },
                        { id: "Builders", conditions: (module) => (module.TemplateMessage && module.HydratedFourRowTemplate) ? module : null },
                        { id: "OpenChat", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null },
                        { id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
                        { id: "SendTextMsgToChat", conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
                        { id: "SendSeen", conditions: (module) => (module.sendSeen) ? module.sendSeen : null },
                        { id: "Sticker", conditions: (module) => (module.default && module.default.Sticker) ? module.default.Sticker : null },
                        { id: "sendDelete", conditions: (module) => (module.sendDelete) ? module.sendDelete : null },
                        { id: "sendMsgToChat", conditions: (module) => (module.sendMsgToChat) ? module.sendMsgToChat : null },
                        { id: "WidFactory", conditions: (e) => (e.isWidlike && e.createWid && e.createWidFromWidLike ? e : null) },
                        { id: "MaybeMeUser", conditions: (e) => (e.getMaybeMeUser ? e : null) },
                        { id: "addAndSendMsgToChat", conditions: (e) => (e.addAndSendMsgToChat ? e.addAndSendMsgToChat : null) },
                        { id: "Catalog", conditions: (module) => (module.Catalog) ? module.Catalog : null },
                        { id: "Parser", conditions: (module) => (module.convertToTextWithoutSpecialEmojis) ? module.default : null },
                        { id: "Identity", conditions: (module) => (module.queryIdentity && module.updateIdentity) ? module : null },
                        { id: "Features", conditions: (module) => (module.FEATURE_CHANGE_EVENT && module.features) ? module : null },
                        { id: "MessageUtils", conditions: (module) => (module.storeMessages && module.appendMessage) ? module : null },
                        { id: "Participants", conditions: (module) => (module.addParticipants && module.removeParticipants && module.promoteParticipants && module.demoteParticipants) ? module : null }
                    ];
                    for (let idx in modules) {
                        if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                            // if(modules[idx]){
                            //     console.log(modules[idx]);
                            // }
                            neededObjects.forEach((needObj) => {
                                if (!needObj.conditions || needObj.foundedModule)
                                    return;
                                let neededModule = needObj.conditions(modules[idx]);
                                if (neededModule !== null) {
                                    foundCount++;
                                    needObj.foundedModule = neededModule;
                                }
                            });

                            if (foundCount == neededObjects.length) {
                                break;
                            }
                        }
                    }

                    let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
                    window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
                    neededObjects.splice(neededObjects.indexOf(neededStore), 1);
                    console.log(neededObjects);
                    neededObjects.forEach((needObj) => {
                        if (needObj.foundedModule) {
                            window.Store[needObj.id] = needObj.foundedModule;
                        }
                    });

                    window.Store.Chat.modelClass.prototype.sendMessage = function(e) {
                        window.Store.SendTextMsgToChat(this, ...arguments);
                    }

                    return window.Store;
                }

                if (typeof webpackJsonp === 'function') {
                    webpackJsonp([], { 'parasite': (x, y, z) => getStore(z) }, ['parasite']);
                } else if (window.webpackChunkwhatsapp_web_client) {
                    let tag = new Date().getTime();
                    window.webpackChunkwhatsapp_web_client.push([
                        ["parasite" + tag],
                        {

                        },
                        function(o, e, t) {
                            let modules = [];
                            for (let idx in o.m) {
                                let module = o(idx);
                                modules.push(module);
                            }
                            getStore(modules);
                        }
                    ], { 'parasite': (x, y, z) => getStore(z) }, ['parasite']);
                } else {
                    throw new Error("Not Found");
                }

            })();

            console.log(window.Store);
        }

        window.WAPI = {
            lastRead: {}
        };

        window.WAPI._serializeRawObj = (obj) => {
            if (obj) {
                return obj.toJSON();
            }
            return {}
        };

        /**
         * Serializes a chat object
         *
         * @param rawChat Chat object
         * @returns {{}}
         */

        window.WAPI._serializeChatObj = (obj) => {
            if (obj == undefined) {
                return null;
            }

            return Object.assign(window.WAPI._serializeRawObj(obj), {
                kind: obj.kind,
                isGroup: obj.isGroup,
                contact: obj['contact'] ? window.WAPI._serializeContactObj(obj['contact']) : null,
                groupMetadata: obj["groupMetadata"] ? window.WAPI._serializeRawObj(obj["groupMetadata"]) : null,
                presence: obj["presence"] ? window.WAPI._serializeRawObj(obj["presence"]) : null,
                msgs: null
            });
        };

        window.WAPI._serializeContactObj = (obj) => {
            if (obj == undefined) {
                return null;
            }

            return Object.assign(window.WAPI._serializeRawObj(obj), {
                formattedName: obj.formattedName,
                isHighLevelVerified: obj.isHighLevelVerified,
                isMe: obj.isMe,
                isMyContact: obj.isMyContact,
                isPSA: obj.isPSA,
                isUser: obj.isUser,
                isVerified: obj.isVerified,
                isWAContact: obj.isWAContact,
                profilePicThumbObj: obj.profilePicThumb ? WAPI._serializeProfilePicThumb(obj.profilePicThumb) : {},
                statusMute: obj.statusMute,
                msgs: null
            });
        };

        window.WAPI._serializeMessageObj = (obj) => {
            if (obj == undefined) {
                return null;
            }

            return Object.assign(window.WAPI._serializeRawObj(obj), {
                id: obj.id._serialized,
                sender: obj["senderObj"] ? WAPI._serializeContactObj(obj["senderObj"]) : null,
                timestamp: obj["t"],
                content: obj["body"],
                isGroupMsg: obj.isGroupMsg,
                isLink: obj.isLink,
                isMMS: obj.isMMS,
                isMedia: obj.isMedia,
                isNotification: obj.isNotification,
                isPSA: obj.isPSA,
                type: obj.type,
                chat: WAPI._serializeChatObj(obj['chat']),
                chatId: obj.id.remote,
                quotedMsgObj: WAPI._serializeMessageObj(obj['_quotedMsgObj']),
                mediaData: window.WAPI._serializeRawObj(obj['mediaData'])
            });
        };

        window.WAPI._serializeNumberStatusObj = (obj) => {
            if (obj == undefined) {
                return null;
            }

            return Object.assign({}, {
                id: obj.jid,
                status: obj.status,
                isBusiness: (obj.biz === true),
                canReceiveMessage: (obj.status === 200)
            });
        };

        window.WAPI._serializeProfilePicThumb = (obj) => {
            if (obj == undefined) {
                return null;
            }

            return Object.assign({}, {
                eurl: obj.eurl,
                id: obj.id,
                img: obj.img,
                imgFull: obj.imgFull,
                raw: obj.raw,
                tag: obj.tag
            });
        }

        window.WAPI.createGroup = function(name, contactsId) {
            if (!Array.isArray(contactsId)) {
                contactsId = [contactsId];
            }

            return window.Store.Wap.createGroup(name, contactsId);
        };

        window.WAPI.leaveGroup = function(groupId) {
            groupId = typeof groupId == "string" ? groupId : groupId._serialized;
            var group = WAPI.getChat(groupId);
            return group.sendExit()
        };

        window.WAPI.getAllContacts = function(done) {
            const contacts = window.Store.Contact.map((contact) => WAPI._serializeContactObj(contact));

            if (done !== undefined) done(contacts);
            return contacts;
        };

        /**
         * Fetches all contact objects from store, filters them
         *
         * @param done Optional callback function for async execution
         * @returns {Array|*} List of contacts
         */
        window.WAPI.getMyContacts = function(done) {
            const contacts = window.Store.Contact.filter((contact) => contact.isMyContact === true).map((contact) => WAPI._serializeContactObj(contact));
            if (done !== undefined) done(contacts);
            return contacts;
        };

        /**
         * Fetches contact object from store by ID
         *
         * @param id ID of contact
         * @param done Optional callback function for async execution
         * @returns {T|*} Contact object
         */
        window.WAPI.getContact = function(id, done) {
            const found = window.Store.Contact.get(id);

            if (done !== undefined) done(window.WAPI._serializeContactObj(found))
            return window.WAPI._serializeContactObj(found);
        };


        window.WAPI.syncContacts = function() {
            Store.Contact.sync()
            return true;
        }

        /**
         * Fetches all chat objects from store
         *
         * @param done Optional callback function for async execution
         * @returns {Array|*} List of chats
         */
        window.WAPI.getAllChats = function(done) {
            const chats = window.Store.Chat.map((chat) => WAPI._serializeChatObj(chat));

            if (done !== undefined) done(chats);
            return chats;
        };

        window.WAPI.haveNewMsg = function(chat) {
            return chat.unreadCount > 0;
        };

        window.WAPI.getAllChatsWithNewMsg = function(done) {
            const chats = window.Store.Chat.filter(window.WAPI.haveNewMsg).map((chat) => WAPI._serializeChatObj(chat));

            if (done !== undefined) done(chats);
            return chats;
        };

        /**
         * Fetches all chat IDs from store
         *
         * @param done Optional callback function for async execution
         * @returns {Array|*} List of chat id's
         */
        window.WAPI.getAllChatIds = function(done) {
            const chatIds = window.Store.Chat.map((chat) => chat.id._serialized || chat.id);

            if (done !== undefined) done(chatIds);
            return chatIds;
        };

        window.WAPI.getAllNewMessages = async function() {
            return JSON.stringify(WAPI.getAllChatsWithNewMsg().map(c => WAPI.getChat(c.id._serialized)).map(c => c.msgs._models.filter(x => x.isNewMsg)) || [])
        }
		
		
		

        // nnoo longer determined by x.ack==-1
        window.WAPI.getAllUnreadMessages = async function() {
            
			//return  Store.Chat._models.filter(chat => chat.unreadCount && chat.unreadCount > 0).map(unreadChat => unreadChat.msgs._models.slice(-1 * unreadChat.unreadCount)).flat().map(WAPI._serializeMessageObj);
			return  Store.Chat._models.filter(chat => chat.unreadCount && chat.unreadCount > 0).map(unreadChat => unreadChat.msgs._models.slice(-1 * unreadChat.unreadCount)).flat().map(WAPI._serializeMessageObj);
        }

        window.WAPI.getIndicatedNewMessages = async function() {
            return JSON.stringify(Store.Chat.models.filter(chat => chat.unreadCount).map(chat => { return { id: chat.id, indicatedNewMessages: chat.msgs.models.slice(Math.max(chat.msgs.length - chat.unreadCount, 0)).filter(msg => !msg.id.fromMe) } }))
        }

        window.WAPI.getSingleProperty = function(namespace, id, property) {
            if (Store[namespace] && Store[namespace].get(id) && Object.keys(Store[namespace].get(id)).find(x => x.includes(property))) return Store[namespace].get(id)[property];
            return 404
        }

        window.WAPI.getAllChatsWithMessages = async function(onlyNew) {
                let x = [];
                if (onlyNew) { x.push(WAPI.getAllChatsWithNewMsg().map(c => WAPI.getChat(c.id._serialized))); } else {
                    x.push(WAPI.getAllChatIds().map((c) => WAPI.getChat(c)));
                }
                const result = (await Promise.all(x)).flatMap(x => x);
                return JSON.stringify(result);
            }
            /**
             * Fetches all groups objects from store
             *
             * @param done Optional callback function for async execution
             * @returns {Array|*} List of chats
             */
        window.WAPI.getAllGroups = function(done) {
            const groups = window.Store.Chat.filter((chat) => chat.isGroup);

            if (done !== undefined) done(groups);
            return groups;
        };

        /**
         * Sets the chat state
         *
         * @param {0|1|2} chatState The state you want to set for the chat. Can be TYPING (1), RECRDING (2) or PAUSED (3);
         * returns {boolean}
         */
        window.WAPI.sendChatstate = async function(state, chatId) {
            switch (state) {
                case 0:
                    await window.Store.ChatStates.sendChatStateComposing(chatId);
                    break;
                case 1:
                    await window.Store.ChatStates.sendChatStateRecording(chatId);
                    break;
                case 2:
                    await window.Store.ChatStates.sendChatStatePaused(chatId);
                    break;
                default:
                    return false
            }
            return true;
        };


        /**
         * Fetches chat object from store by ID
         *
         * @param id ID of chat
         * @param done Optional callback function for async execution
         * @returns {T|*} Chat object
         */
        window.WAPI.getChat = function(id, done) {
            id = typeof id == "string" ? id : id._serialized;
            const found = window.Store.Chat.get(id);
            if (found) found.sendMessage = (found.sendMessage) ? found.sendMessage : function() { return window.Store.sendMessage.apply(this, arguments); };
            if (done !== undefined) done(found);
            return found;
        }

        /**
         * Get your status
         * @param {string} to '000000000000@c.us'
         * returns: {string,string} and string -"Hi, I am using WA"
         */
        window.WAPI.getStatus = async(id) => {
            return await Store.MyStatus.getStatus(id)
        }
        window.WAPI.getChatByName = function(name, done) {
            const found = window.WAPI.getAllChats().find(val => val.name.includes(name))
            if (done !== undefined) done(found);
            return found;
        };

        window.WAPI.sendImageFromDatabasePicBot = function(picId, chatId, caption) {
            var chatDatabase = window.WAPI.getChatByName('DATABASEPICBOT');
            var msgWithImg = chatDatabase.msgs.find((msg) => msg.caption == picId);

            if (msgWithImg === undefined) {
                return false;
            }
            var chatSend = WAPI.getChat(chatId);
            if (chatSend === undefined) {
                return false;
            }
            const oldCaption = msgWithImg.caption;

            msgWithImg.id.id = window.WAPI.getNewId();
            msgWithImg.id.remote = chatId;
            msgWithImg.t = Math.ceil(new Date().getTime() / 1000);
            msgWithImg.to = chatId;

            if (caption !== undefined && caption !== '') {
                msgWithImg.caption = caption;
            } else {
                msgWithImg.caption = '';
            }

            msgWithImg.collection.send(msgWithImg).then(function(e) {
                msgWithImg.caption = oldCaption;
            });

            return true;
        };

        window.WAPI.getGeneratedUserAgent = function(useragent) {
            if (!useragent.includes('WhatsApp')) return 'WhatsApp/0.4.315 ' + useragent;
            return useragent.replace(useragent.match(/WhatsApp\/([.\d])*/g)[0].match(/[.\d]*/g).find(x => x), window.Debug.VERSION)
        }

        window.WAPI.getWAVersion = function() {
            return window.Debug.VERSION;
        }

        /**
         * Automatically sends a link with the auto generated link preview. You can also add a custom message to be added.
         * @param chatId
         * @param url string A link, for example for youtube. e.g https://www.youtube.com/watch?v=61O-Galzc5M
         * @param text string Custom text as body of the message, this needs to include the link or it will be appended after the link.
         */
        window.WAPI.sendLinkWithAutoPreview = async function(chatId, url, text) {
            var chatSend = WAPI.getChat(chatId);
            if (chatSend === undefined) {
                return false;
            }
            const linkPreview = await Store.WapQuery.queryLinkPreview(url);
            return (await chatSend.sendMessage(text.includes(url) ? text : `${url}\n${text}`, { linkPreview })) == 'success'
        }

        window.WAPI.sendMessageWithThumb = function(thumb, url, title, description, text, chatId, done) {
            var chatSend = WAPI.getChat(chatId);
            if (chatSend === undefined) {
                if (done !== undefined) done(false);
                return false;
            }
            var linkPreview = {
                canonicalUrl: url,
                description: description,
                matchedText: url,
                title: title,
                thumbnail: thumb,
                compose: true
            };
            chatSend.sendMessage(text, {
                linkPreview: linkPreview,
                mentionedJidList: [],
                quotedMsg: null,
                quotedMsgAdminGroupJid: null
            });
            if (done !== undefined) done(true);
            return true;
        };

        window.WAPI.revokeGroupInviteLink = async function(chatId) {
            var chat = Store.Chat.get(chatId);
            if (!chat.isGroup) return false;
            await Store.GroupInvite.revokeGroupInvite(chat);
            return true;
        }

        window.WAPI.getGroupInviteLink = async function(chatId) {
            var chat = Store.Chat.get(chatId);
            if (!chat.isGroup) return false;
            await Store.GroupInvite.queryGroupInviteCode(chat);
            return `https://chat.whatsapp.com/${chat.inviteCode}`
        }

        window.WAPI.getNewId = function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 20; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };

        window.WAPI.getChatById = function(id, done) {
            let found = WAPI.getChat(id);
            if (found) {
                found = WAPI._serializeChatObj(found);
            } else {
                found = false;
            }

            if (done !== undefined) done(found);
            return found;
        };


        /**
         * I return all unread messages from an asked chat and mark them as read.
         *
         * :param id: chat id
         * :type  id: string
         *
         * :param includeMe: indicates if user messages have to be included
         * :type  includeMe: boolean
         *
         * :param includeNotifications: indicates if notifications have to be included
         * :type  includeNotifications: boolean
         *
         * :param done: callback passed by selenium
         * :type  done: function
         *
         * :returns: list of unread messages from asked chat
         * :rtype: object
         */
        window.WAPI.getUnreadMessagesInChat = function(id, includeMe, includeNotifications, done) {
            // get chat and its messages
            let chat = WAPI.getChat(id);
            let messages = chat.msgs._models;

            // initialize result list
            let output = [];

            // look for unread messages, newest is at the end of array
            for (let i = messages.length - 1; i >= 0; i--) {
                // system message: skip it
                if (i === "remove") {
                    continue;
                }

                // get message
                let messageObj = messages[i];

                // found a read message: stop looking for others
                if (typeof(messageObj.isNewMsg) !== "boolean" || messageObj.isNewMsg === false) {
                    continue;
                } else {
                    messageObj.isNewMsg = false;
                    // process it
                    let message = WAPI.processMessageObj(messageObj,
                        includeMe,
                        includeNotifications);

                    // save processed message on result list
                    if (message)
                        output.push(message);
                }
            }
            // callback was passed: run it
            if (done !== undefined) done(output);
            // return result list
            return output;
        };


        /**
         * Load more messages in chat object from store by ID
         *
         * @param id ID of chat
         * @param done Optional callback function for async execution
         * @returns None
         */
        window.WAPI.loadEarlierMessages = function(id, done) {
            const found = WAPI.getChat(id);
            if (done !== undefined) {
                found.loadEarlierMsgs().then(function() {
                    done()
                });
            } else {
                found.loadEarlierMsgs();
            }
        };

        /**
         * Load more messages in chat object from store by ID
         *
         * @param id ID of chat
         * @param done Optional callback function for async execution
         * @returns None
         */
        window.WAPI.loadAllEarlierMessages = function(id, done) {
            const found = WAPI.getChat(id);
            x = function() {
                if (!found.msgs.msgLoadState.noEarlierMsgs) {
                    found.loadEarlierMsgs().then(x);
                } else if (done) {
                    done();
                }
            };
            x();
        };

        window.WAPI.asyncLoadAllEarlierMessages = function(id, done) {
            done();
            window.WAPI.loadAllEarlierMessages(id);
        };

        window.WAPI.areAllMessagesLoaded = function(id, done) {
            const found = WAPI.getChat(id);
            if (!found.msgs.msgLoadState.noEarlierMsgs) {
                if (done) done(false);
                return false
            }
            if (done) done(true);
            return true
        };

        /**
         * Load more messages in chat object from store by ID till a particular date
         *
         * @param id ID of chat
         * @param lastMessage UTC timestamp of last message to be loaded
         * @param done Optional callback function for async execution
         * @returns None
         */

        window.WAPI.loadEarlierMessagesTillDate = function(id, lastMessage, done) {
            const found = WAPI.getChat(id);
            x = function() {
                if (found.msgs.models[0].t > lastMessage && !found.msgs.msgLoadState.noEarlierMsgs) {
                    found.loadEarlierMsgs().then(x);
                } else {
                    done();
                }
            };
            x();
        };


        /**
         * Fetches all group metadata objects from store
         *
         * @param done Optional callback function for async execution
         * @returns {Array|*} List of group metadata
         */
        window.WAPI.getAllGroupMetadata = function(done) {
            const groupData = window.Store.GroupMetadata.map((groupData) => groupData.all);

            if (done !== undefined) done(groupData);
            return groupData;
        };

        /**
         * Fetches group metadata object from store by ID
         *
         * @param id ID of group
         * @param done Optional callback function for async execution
         * @returns {T|*} Group metadata object
         */
        window.WAPI.getGroupMetadata = async function(id, done) {
            let output = window.Store.GroupMetadata.get(id);

            if (output !== undefined) {
                if (output.stale) {
                    await window.Store.GroupMetadata.update(id);
                }
            }

            if (done !== undefined) done(output);
            return output;

        };


        /**
         * Fetches group participants
         *
         * @param id ID of group
         * @returns {Promise.<*>} Yields group metadata
         * @private
         */
        window.WAPI._getGroupParticipants = async function(id) {
            const metadata = await WAPI.getGroupMetadata(id);
            return metadata.participants;
        };

        /**
         * Fetches IDs of group participantsgetGroupParticipantIDs
         *
         * @param id ID of group
         * @param done Optional callback function for async execution
         * @returns {Promise.<Array|*>} Yields list of IDs
         */
        window.WAPI.getGroupParticipantIDs = async function(id, done) {
            const output = (await WAPI._getGroupParticipants(id))
                .map((participant) => participant.id);

            //if (done !== undefined) done(output);
            return output;
        };

        window.WAPI.getGroupAdmins = async function(id, done) {
            const output = (await WAPI._getGroupParticipants(id))
                .filter((participant) => participant.isAdmin)
                .map((admin) => admin.id);

            if (done !== undefined) done(output);
            return output;
        };

        /**
         * Gets object representing the logged in user
         *
         * @returns {Array|*|$q.all}
         */
        window.WAPI.getMe = function(done) {
            const rawMe = window.Store.Contact.get(window.Store.Conn.me);

            if (done !== undefined) done(rawMe.all);
            return rawMe.all;
        };

        window.WAPI.isLoggedIn = function(done) {
            // Contact always exists when logged in
            const isLogged = window.Store.Contact && window.Store.Contact.checksum !== undefined;

            if (done !== undefined) done(isLogged);
            return isLogged;
        };

        window.WAPI.isConnected = function(done) {
            // Phone Disconnected icon appears when phone is disconnected from the tnternet
            const isConnected = document.querySelector('*[data-icon="alert-phone"]') !== null ? false : true;

            if (done !== undefined) done(isConnected);
            return isConnected;
        };

        window.WAPI.processMessageObj = function(messageObj, includeMe, includeNotifications) {
            if (messageObj.isNotification) {
                if (includeNotifications)
                    return WAPI._serializeMessageObj(messageObj);
                else
                    return;
                // System message
                // (i.e. "Messages you send to this chat and calls are now secured with end-to-end encryption...")
            } else if (messageObj.id.fromMe === false || includeMe) {
                return WAPI._serializeMessageObj(messageObj);
            }
            return;
        };

        window.WAPI.getAllMessagesInChat = function(id, includeMe, includeNotifications, done) {
            const chat = WAPI.getChat(id);
            let output = [];
            const messages = chat.msgs._models;

            for (const i in messages) {
                if (i === "remove") {
                    continue;
                }
                const messageObj = messages[i];

                let message = WAPI.processMessageObj(messageObj, includeMe, includeNotifications)
                if (message)
                    output.push(message);
            }
            if (done !== undefined) done(output);
            return output;
        };

        window.WAPI.getAllMessageIdsInChat = function(id, includeMe, includeNotifications, done) {
            const chat = WAPI.getChat(id);
            let output = [];
            const messages = chat.msgs._models;

            for (const i in messages) {
                if ((i === "remove") ||
                    (!includeMe && messages[i].isMe) ||
                    (!includeNotifications && messages[i].isNotification)) {
                    continue;
                }
                output.push(messages[i].id._serialized);
            }
            if (done !== undefined) done(output);
            return output;
        };

        window.WAPI.getMessageById = function(id, done) {
            let result = false;
            try {
                let msg = window.Store.Msg.get(id);
                if (msg) {
                    result = WAPI.processMessageObj(msg, true, true);
                }
            } catch (err) {}

            if (done !== undefined) {
                done(result);
            } else {
                return result;
            }
        };

        window.WAPI.ReplyMessage = function(idMessage, message, done) {
            var messageObject = window.Store.Msg.get(idMessage);
            if (messageObject === undefined) {
                if (done !== undefined) done(false);
                return false;
            }
            //messageObject = messageObject.value();

            const chat = WAPI.getChat(messageObject.chat.id)
            if (chat !== undefined) {
                if (done !== undefined) {
                    chat.sendMessage(message, null, messageObject).then(function() {
                        function sleep(ms) {
                            return new Promise(resolve => setTimeout(resolve, ms));
                        }

                        var trials = 0;

                        function check() {
                            for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
                                let msg = chat.msgs.models[i];

                                if (!msg.senderObj.isMe || msg.body != message) {
                                    continue;
                                }
                                done(WAPI._serializeMessageObj(msg));
                                return True;
                            }
                            trials += 1;
                            console.log(trials);
                            if (trials > 30) {
                                done(true);
                                return;
                            }
                            sleep(500).then(check);
                        }
                        check();
                    });
                    return true;
                } else {
                    chat.sendMessage(message, null, messageObject);
                    return true;
                }
            } else {
                if (done !== undefined) done(false);
                return false;
            }
        };

        window.WAPI.sendMessageToID = function(id, message, done) {
            try {
                var idUser = new window.Store.UserConstructor(id);
                // create new chat
                return Store.Chat.find(idUser).then((chat) => {
                    if (done !== undefined) {
                        chat.sendMessage(message).then(function() {
                            done(true);
                        });
                        return true;
                    } else {
                        chat.sendMessage(message);
                        return true;
                    }
                });
            } catch (e) {
                var idUser = new window.Store.UserConstructor(id, { intentionallyUsePrivateConstructor: true });
                // create new chat
                return Store.FindChat.findChat(idUser).then((chat) => {
                    chat.sendMessage(message);
                })
            }
            if (done !== undefined) done(false);
            return false;
        }

        window.WAPI.sendMessage = function(id, message, done) {
            var chat = WAPI.getChat(id);
            if (chat !== undefined) {
                if (done !== undefined) {
                    chat.sendMessage(message).then(function() {
                        function sleep(ms) {
                            return new Promise(resolve => setTimeout(resolve, ms));
                        }

                        var trials = 0;

                        function check() {
                            for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
                                let msg = chat.msgs.models[i];

                                if (!msg.senderObj.isMe || msg.body != message) {
                                    continue;
                                }
                                done(WAPI._serializeMessageObj(msg));
                                return True;
                            }
                            trials += 1;
                            console.log(trials);
                            if (trials > 30) {
                                done(true);
                                return;
                            }
                            sleep(500).then(check);
                        }
                        check();
                    });
                    return true;
                } else {
                    chat.sendMessage(message);
                    return true;
                }
            } else {
                if (done !== undefined) done(false);
                return false;
            }
        };

        window.WAPI.sendMessage2 = function(id, message, done) {
            var chat = WAPI.getChat(id);
            if (chat !== undefined) {
                try {
                    if (done !== undefined) {
                        chat.sendMessage(message).then(function() {
                            done(true);
                        });
                    } else {
                        chat.sendMessage(message);
                    }
                    return true;
                } catch (error) {
                    if (done !== undefined) done(false)
                    return false;
                }
            }
            if (done !== undefined) done(false)
            return false;
        };

        window.WAPI.sendSeen = function(id, done) {
            var chat = window.WAPI.getChat(id);
            if (chat !== undefined) {
                if (done !== undefined) {
                    if (chat.getLastMsgKeyForAction === undefined)
                        chat.getLastMsgKeyForAction = function() {};
                    Store.SendSeen(chat, false).then(function() {
                        done(true);
                    });
                    return true;
                } else {
                    Store.SendSeen(chat, false);
                    return true;
                }
            }
            if (done !== undefined) done();
            return false;
        };

        function isChatMessage(message) {
            if (message.isSentByMe) {
                return false;
            }
            if (message.isNotification) {
                return false;
            }
            if (!message.isUserCreatedType) {
                return false;
            }
            return true;
        }


        window.WAPI.getUnreadMessages = function(includeMe, includeNotifications, use_unread_count, done) {
            const chats = window.Store.Chat.models;
            let output = [];

            for (let chat in chats) {
                if (isNaN(chat)) {
                    continue;
                }

                let messageGroupObj = chats[chat];
                let messageGroup = WAPI._serializeChatObj(messageGroupObj);

                messageGroup.messages = [];

                const messages = messageGroupObj.msgs._models;
                for (let i = messages.length - 1; i >= 0; i--) {
                    let messageObj = messages[i];
                    if (typeof(messageObj.isNewMsg) != "boolean" || messageObj.isNewMsg === false) {
                        continue;
                    } else {
                        messageObj.isNewMsg = false;
                        let message = WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
                        if (message) {
                            messageGroup.messages.push(message);
                        }
                    }
                }

                if (messageGroup.messages.length > 0) {
                    output.push(messageGroup);
                } else { // no messages with isNewMsg true
                    if (use_unread_count) {
                        let n = messageGroupObj.unreadCount; // will use unreadCount attribute to fetch last n messages from sender
                        for (let i = messages.length - 1; i >= 0; i--) {
                            let messageObj = messages[i];
                            if (n > 0) {
                                if (!messageObj.isSentByMe) {
                                    let message = WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
                                    messageGroup.messages.unshift(message);
                                    n -= 1;
                                }
                            } else if (n === -1) { // chat was marked as unread so will fetch last message as unread
                                if (!messageObj.isSentByMe) {
                                    let message = WAPI.processMessageObj(messageObj, includeMe, includeNotifications);
                                    messageGroup.messages.unshift(message);
                                    break;
                                }
                            } else { // unreadCount = 0
                                break;
                            }
                        }
                        if (messageGroup.messages.length > 0) {
                            messageGroupObj.unreadCount = 0; // reset unread counter
                            output.push(messageGroup);
                        }
                    }
                }
            }
            if (done !== undefined) {
                done(output);
            }
            return output;
        };

        window.WAPI.getGroupOwnerID = async function(id, done) {
            const output = (await WAPI.getGroupMetadata(id)).owner.id;
            if (done !== undefined) {
                done(output);
            }
            return output;

        };

        window.WAPI.getCommonGroups = async function(id, done) {
            let output = [];

            groups = window.WAPI.getAllGroups();

            for (let idx in groups) {
                try {
                    participants = await window.WAPI.getGroupParticipantIDs(groups[idx].id);
                    if (participants.filter((participant) => participant == id).length) {
                        output.push(groups[idx]);
                    }
                } catch (err) {
                    console.log("Error in group:");
                    console.log(groups[idx]);
                    console.log(err);
                }
            }

            if (done !== undefined) {
                done(output);
            }
            return output;
        }
        window.WAPI.validateNumber = async function(e) {
            var s = new window.Store.UserConstructor(e, { intentionallyUsePrivateConstructor: !0 });
            r = await window.Store.FindChat.findChat(s).then((chat) => {return chat});
            return r.trusted;
        }
        window.WAPI.sendExist = async function(e, t = !0, n = !0) {
            const i = WAPI.sendCheckType(e);
            if (i && 404 === i.status) return i;
            let o = await window.WAPI.checkNumberStatus(e, !1);
            if (404 === o.status && !e.includes("@g.us") && !e.includes("@broadcast")) return WAPI.scope(e, !0, o.status, "The number does not exist");
            const a = new Store.WidFactory.createWid(e);
            let r = o && o.id && o.id._serialized ? await window.WAPI.getChat(o.id._serialized) : void 0;
            if (o.numberExists && void 0 === r) {
                var s = new window.Store.UserConstructor(e, { intentionallyUsePrivateConstructor: !0 });
                r = await window.Store.FindChat.findChat(a).then((chat) => {return chat});
            }
            if (!r) {
                const e = await window.Store.FindChat.findChat(a).then((chat) => {return chat});
                e && (r = e && e.id && e.id._serialized ? await window.WAPI.getChat(e.id._serialized) : void 0);
            }
            return o.numberExists || r.t || !r.isUser ?
                o.numberExists || r.t || !r.isGroup ?
                !o.numberExists && !r.t && r.id && "status" != r.id.user && r.isBroadcast ?
                WAPI.scope(e, !0, o.status, "The transmission list number does not exist on your chat list, or it does not exist at all!") :
                r ?
                (n && (await window.Store.SendSeen(r, !1)), t ? r : WAPI.scope(e, !1, 200)) :
                WAPI.scope(e, !0, 404) :
                WAPI.scope(e, !0, o.status, "The group number does not exist on your chat list, or it does not exist at all!") :
                WAPI.scope(e, !0, o.status, "The number does not exist");
        }
        window.WAPI.sendCheckType = function(e) {
            if (!e) return WAPI.scope(e, !0, 404, "It is necessary to pass a number!");
            if ("string" == typeof e) {
                const t = "@c.us",
                    n = "@broadcast",
                    i = "@g.us";
                if (t !== e.substr(-t.length, t.length) && n !== e.substr(-n.length, n.length) && i !== e.substr(-i.length, i.length))
                    return WAPI.scope(e, !0, 404, "The chat number must contain the parameters @c.us, @broadcast or @g.us. At the end of the number!");
                if (t === e.substr(-t.length, t.length) && ((e.match(/(@c.us)/g) && e.match(/(@c.us)/g).length > 1) || !e.match(/^(\d+(\d)*@c.us)$/g)))
                    return WAPI.scope(e, !0, 404, "incorrect parameters! Use as an example: 000000000000@c.us");
                if (n === e.substr(-n.length, n.length) && ((e.match(/(@broadcast)/g) && e.match(/(@broadcast)/g).length > 1) || !e.match(/^(\d+(\d)*@broadcast)$/g)))
                    return WAPI.scope(e, !0, 404, "incorrect parameters! Use as an example: 0000000000@broadcast");
                if (i === e.substr(-i.length, i.length) && e.match(/(@g.us)/g) && e.match(/(@g.us)/g).length > 1)
                    return WAPI.scope(e, !0, 404, "incorrect parameters! Use as an example: 00000000-000000@g.us or 00000000000000@g.us");
            }
        }
        window.WAPI.scope = function(e, t, n, i = null, o = null) {
            return { me: WAPI.getHost(), to: e, erro: t, text: i, status: n, result: o };
        }
        window.WAPI.getHost = async function() {
            const e = await Store.MaybeMeUser.getMaybeMeUser(),
                t = await WAPI.sendExist(e._serialized),
                n = await Store.MyStatus.getStatus(t);
            return await WAPI._serializeMeObj(n);
        }
        window.WAPI.sendButtons = async function(e, t, n, i) {
            var idUser = new window.Store.UserConstructor(e, { intentionallyUsePrivateConstructor: true });
            const o = await Store.FindChat.findChat(idUser).then((chat) => { return chat });
            if (o && 404 != o.status && o.id) {
                const e = await WPP.chat.generateMessageID(o.id._serialized),
                s = {
                    id: e,
                    ack: 1,
                    from: await Store.MaybeMeUser.getMaybeMeUser(),
                    to: new Store.WidFactory.createWid(o.id),
                    local: !0,
                    self: "out",
                    t: parseInt((new Date).getTime() / 1e3),
                    isNewMsg: !0,
                    type: "chat",
                    body: t,
                    caption: t,
                    footer: i,
                    content: t,
                    isNewMsg: true,
                    isForwarded: false,
                    broadcast: false,
                    isQuotedMsgAvailable: false,
                    shouldEnableHsm: true,
                    __x_hasTemplateButtons: true,
                    invis: true,
                };
                var a = await WPP.chat.prepareMessageButtons({
                    "phone": new Store.WidFactory.createWid(o.id),
                    "message": t,
                    "options": {
                      "useTemplateButtons": "true",
                      "buttons": n,
                    }
                  },{
                      "useTemplateButtons": "true",
                      "buttons": n,
                  });
                Object.assign(s, a);
                var r = (await Promise.all(window.Store.addAndSendMsgToChat(o, s)));
                return "success" === r[1] || "OK" === r[1];
            }
            return o
        }
        window.WAPI.sendList = async function(e,b,d,section) {
            var idUser = new window.Store.UserConstructor(e, { intentionallyUsePrivateConstructor: true });
            const o = await Store.FindChat.findChat(idUser).then((chat) => { return chat });
            if (o && 404 != o.status && o.id) {
                const e = await WPP.chat.generateMessageID(o.id._serialized),
                    s = {
                        id: e,
                        ack: 0,
                        from: await Store.MaybeMeUser.getMaybeMeUser(),
                        to: o.id,
                        local: !0,
                        self: "out",
                        t: parseInt((new Date).getTime() / 1e3),
                        isNewMsg: !0,
                        type: "chat",
                    };
                    var n = {
                        buttonText: b,
                        description: d,
                        sections: section,
                    }
                    var a = await WPP.chat.sendListMessage(o.id,n);
                // var a = await WPP.chat.sendListMessage(o.id,{
                //     buttonText: 'Click here',
                //     description: 'Choose one option',
                //     sections: [
                //       {
                //         title: 'Main Menu',
                //         rows: [
                //           {
                //             rowId: '1',
                //             title: 'Re-Order your previous order',
                //           },
                //           {
                //             rowId: '2',
                //             title: 'Make a new order',
                //           },
                //           {
                //             rowId: '3',
                //             title: 'Find my nearest store 3',
                //           },
                //         ],
                //       },
                //     ],
                // });
                Object.assign(s, a);
                var r = (await Promise.all(window.Store.addAndSendMsgToChat(o, s)));
                return "success" === r[1] || "OK" === r[1];
            }
            return o
        }
        window.WAPI.sendFileTemplate = async function(e, b , t, n) {
            var idUser = new window.Store.UserConstructor(e, { intentionallyUsePrivateConstructor: true });
            const o = await Store.FindChat.findChat(idUser).then((chat) => { return chat });
            if (o && 404 != o.status && o.id) {
                const e = await WPP.chat.generateMessageID(o.id._serialized),
                s = {
                    id: e,
                    ack: 0,
                    from: await Store.MaybeMeUser.getMaybeMeUser(),
                    to: o.id,
                    local: !0,
                    self: "out",
                    t: parseInt((new Date).getTime() / 1e3),
                    isNewMsg: !0,
                    type: "image",
                    body: t,
                };
                var a = await WPP.chat.sendFileMessage(o.id,b,{useTemplateButtons: true,"buttons": n,caption: t});
                Object.assign(s, a);
                var r = (await Promise.all(window.Store.addAndSendMsgToChat(o, s)));
                return "success" === r[1] || "OK" === r[1];
            }
            return o
        }
        window.WAPI.getProfilePicSmallFromId = function(id, done) {
            window.Store.ProfilePicThumb.find(id).then(function(d) {
                if (d.img !== undefined) {
                    window.WAPI.downloadFileWithCredentials(d.img, done);
                } else {
                    done(false);
                }
            }, function(e) {
                done(false);
            })
        };

        window.WAPI.getProfilePicFromId = function(id, done) {
            window.Store.ProfilePicThumb.find(id).then(function(d) {
                if (d.imgFull !== undefined) {
                    window.WAPI.downloadFileWithCredentials(d.imgFull, done);
                } else {
                    done(false);
                }
            }, function(e) {
                done(false);
            })
        };

        window.WAPI.downloadFileWithCredentials = function(url, done) {
            let xhr = new XMLHttpRequest();

            xhr.onload = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let reader = new FileReader();
                        reader.readAsDataURL(xhr.response);
                        reader.onload = function(e) {
                            done(reader.result.substr(reader.result.indexOf(',') + 1))
                        };
                    } else {
                        console.error(xhr.statusText);
                    }
                } else {
                    console.log(err);
                    done(false);
                }
            };

            xhr.open("GET", url, true);
            xhr.withCredentials = true;
            xhr.responseType = 'blob';
            xhr.send(null);
        };


        window.WAPI.downloadFile = function(url, done) {
            let xhr = new XMLHttpRequest();


            xhr.onload = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let reader = new FileReader();
                        reader.readAsDataURL(xhr.response);
                        reader.onload = function(e) {
                            done(reader.result.substr(reader.result.indexOf(',') + 1))
                        };
                    } else {
                        console.error(xhr.statusText);
                    }
                } else {
                    console.log(err);
                    done(false);
                }
            };

            xhr.open("GET", url, true);
            xhr.responseType = 'blob';
            xhr.send(null);
        };

        window.WAPI.getBatteryLevel = function(done) {
            if (window.Store.Conn.plugged) {
                if (done !== undefined) {
                    done(100);
                }
                return 100;
            }
            output = window.Store.Conn.battery;
            if (done !== undefined) {
                done(output);
            }
            return output;
        };
        
        window.WAPI.deleteConversation = function(chatId, done) {
            let userId = new window.Store.UserConstructor(chatId, { intentionallyUsePrivateConstructor: true });
            let conversation = WAPI.getChat(userId);

            if (!conversation) {
                if (done !== undefined) {
                    done(false);
                }
                return false;
            }

            window.Store.sendDelete(conversation, false).then(() => {
                if (done !== undefined) {
                    done(true);
                }
            }).catch(() => {
                if (done !== undefined) {
                    done(false);
                }
            });

            return true;
        };

        window.WAPI.deleteMessage = function(chatId, messageArray, revoke = false, done) {
            let userId = new window.Store.UserConstructor(chatId, { intentionallyUsePrivateConstructor: true });
            let conversation = WAPI.getChat(userId);

            if (!conversation) {
                if (done !== undefined) {
                    done(false);
                }
                return false;
            }

            if (!Array.isArray(messageArray)) {
                messageArray = [messageArray];
            }
            let messagesToDelete = messageArray.map(msgId => window.Store.Msg.get(msgId));

            if (revoke) {
                conversation.sendRevokeMsgs(messagesToDelete, conversation);
            } else {
                conversation.sendDeleteMsgs(messagesToDelete, conversation);
            }


            if (done !== undefined) {
                done(true);
            }

            return true;
        };

		window.WAPI.sendConversationSeen=async function(id)
		{
			await WPP.chat.markIsRead(id);
			setTimeout(function(){
				 WPP.chat.markIsUnread(id);
			},500)
		}

        window.WAPI.checkNumberStatus = function(id, done) {
            window.Store.WapQuery.queryExist(id).then((result) => {
                if (done !== undefined) {
                    if (result.jid === undefined) throw 404;
                    done(window.WAPI._serializeNumberStatusObj(result));
                }
            }).catch((e) => {
                if (done !== undefined) {
                    done(window.WAPI._serializeNumberStatusObj({
                        status: e,
                        jid: id
                    }));
                }
            });

            return true;
        };
		
		window.WAPI.checkNumberStatus2 = async function (id) {
            const result = await WPP.contact.queryExists(id);
        
            if (!result) {
              return {
                id: id,
                isBusiness: false,
                canReceiveMessage: false,
                numberExists: false,
                status: 404,
              };
            }
        
            return {
              id: result.wid,
              isBusiness: result.biz,
              canReceiveMessage: true,
              numberExists: true,
              status: 200,
            };
          };

        /**
         * New messages observable functions.
         */
        window.WAPI._newMessagesQueue = [];
        window.WAPI._newMessagesBuffer = (sessionStorage.getItem('saved_msgs') != null) ? JSON.parse(sessionStorage.getItem('saved_msgs')) : [];
        window.WAPI._newMessagesDebouncer = null;
        window.WAPI._newMessagesCallbacks = [];

        window.Store.Msg.off('add');
        sessionStorage.removeItem('saved_msgs');

        window.WAPI._newMessagesListener = window.Store.Msg.on('add', (newMessage) => {
            if (newMessage && newMessage.isNewMsg && !newMessage.isSentByMe) {
                let message = window.WAPI.processMessageObj(newMessage, false, false);
                if (message) {
                    window.WAPI._newMessagesQueue.push(message);
                    window.WAPI._newMessagesBuffer.push(message);
                }

                // Starts debouncer time to don't call a callback for each message if more than one message arrives
                // in the same second
                if (!window.WAPI._newMessagesDebouncer && window.WAPI._newMessagesQueue.length > 0) {
                    window.WAPI._newMessagesDebouncer = setTimeout(() => {
                        let queuedMessages = window.WAPI._newMessagesQueue;

                        window.WAPI._newMessagesDebouncer = null;
                        window.WAPI._newMessagesQueue = [];

                        let removeCallbacks = [];

                        window.WAPI._newMessagesCallbacks.forEach(function(callbackObj) {
                            if (callbackObj.callback !== undefined) {
                                callbackObj.callback(queuedMessages);
                            }
                            if (callbackObj.rmAfterUse === true) {
                                removeCallbacks.push(callbackObj);
                            }
                        });

                        // Remove removable callbacks.
                        removeCallbacks.forEach(function(rmCallbackObj) {
                            let callbackIndex = window.WAPI._newMessagesCallbacks.indexOf(rmCallbackObj);
                            window.WAPI._newMessagesCallbacks.splice(callbackIndex, 1);
                        });
                    }, 1000);
                }
            }
        });

        window.WAPI._unloadInform = (event) => {
            // Save in the buffer the ungot unreaded messages
            window.WAPI._newMessagesBuffer.forEach((message) => {
                Object.keys(message).forEach(key => message[key] === undefined ? delete message[key] : '');
            });
            sessionStorage.setItem("saved_msgs", JSON.stringify(window.WAPI._newMessagesBuffer));

            // Inform callbacks that the page will be reloaded.
            window.WAPI._newMessagesCallbacks.forEach(function(callbackObj) {
                if (callbackObj.callback !== undefined) {
                    callbackObj.callback({ status: -1, message: 'page will be reloaded, wait and register callback again.' });
                }
            });
        };

        window.addEventListener("unload", window.WAPI._unloadInform, false);
        window.addEventListener("beforeunload", window.WAPI._unloadInform, false);
        window.addEventListener("pageunload", window.WAPI._unloadInform, false);

        /**
         * Registers a callback to be called when a new message arrives the WAPI.
         * @param rmCallbackAfterUse - Boolean - Specify if the callback need to be executed only once
         * @param done - function - Callback function to be called when a new message arrives.
         * @returns {boolean}
         */
        window.WAPI.waitNewMessages = function(rmCallbackAfterUse = true, done) {
            window.WAPI._newMessagesCallbacks.push({ callback: done, rmAfterUse: rmCallbackAfterUse });
            return true;
        };

        /**
         * Reads buffered new messages.
         * @param done - function - Callback function to be called contained the buffered messages.
         * @returns {Array}
         */
        window.WAPI.getBufferedNewMessages = function(done) {
            let bufferedMessages = window.WAPI._newMessagesBuffer;
            window.WAPI._newMessagesBuffer = [];
            if (done !== undefined) {
                done(bufferedMessages);
            }
            return bufferedMessages;
        };
        /** End new messages observable functions **/

        window.WAPI.sendImage = function(imgBase64, chatid, filename, caption, done) {
            //var idUser = new window.Store.UserConstructor(chatid);
            var idUser = new window.Store.UserConstructor(chatid, { intentionallyUsePrivateConstructor: true });
            // create new chat
            return Store.FindChat.findChat(idUser).then((chat) => {
                var mediaBlob = window.WAPI.base64ImageToFile(imgBase64, filename);
                var mc = new Store.MediaCollection(chat);
                mc.processAttachments([{ file: mediaBlob }, 1], chat, 1).then(() => {
                    var media = mc._models[0];
                    media.sendToChat(chat, { caption: caption });
                    if (done !== undefined) {
						done(true);
						return true;
					};
                });
            });
        }
	
	  window.WAPI.sendAttachment2 = function(imgBase64, chatid,filename, caption, done) {
            //var idUser = new window.Store.UserConstructor(chatid);
            var idUser = new window.Store.UserConstructor(chatid, { intentionallyUsePrivateConstructor: true });
            // create new chat
            return Store.Chat.find(idUser).then((chat) => {
				var mediaBlob = window.WAPI.base64ImageToFile(imgBase64, filename);
                var mc = new Store.MediaCollection(chat);
                mc.processAttachments([{ file: mediaBlob }, 1], chat, 1).then(() => {
                    var media = mc.models[0];
                    media.sendToChat(chat, { caption: caption });
                    if (done !== undefined) done(true);
                });
            });
        }


        window.WAPI.sendAttachment = function(mediaBlob, chatid, caption, done) {
            //var idUser = new window.Store.UserConstructor(chatid);
            var idUser = new window.Store.UserConstructor(chatid, { intentionallyUsePrivateConstructor: true });
            // create new chat
            return Store.Chat.find(idUser).then((chat) => {
                var mc = new Store.MediaCollection(chat);
                mc.processAttachments([{ file: mediaBlob }, 1], chat, 1).then(() => {
                    var media = mc.models[0];
                    media.sendToChat(chat, { caption: caption });
                    if (done !== undefined) done(true);
                });
            });
        }

        window.WAPI.base64ImageToFile = function(b64Data, filename) {
            var arr = b64Data.split(',');
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
        };

        /**
         * Send contact card to a specific chat using the chat ids
         *
         * @param {string} to '000000000000@c.us'
         * @param {string|array} contact '111111111111@c.us' | ['222222222222@c.us', '333333333333@c.us, ... 'nnnnnnnnnnnn@c.us']
         */
        window.WAPI.sendContact = function(to, contact) {
            if (!Array.isArray(contact)) {
                contact = [contact];
            }
            contact = contact.map((c) => {
                return WAPI.getChat(c).__x_contact;
            });

            if (contact.length > 1) {
                window.WAPI.getChat(to).sendContactList(contact);
            } else if (contact.length === 1) {
                window.WAPI.getChat(to).sendContact(contact[0]);
            }
        };
        /**
         * Create an chat ID based in a cloned one
         *
         * @param {string} chatId '000000000000@c.us'
         */
        window.WAPI.getNewMessageId = function(chatId) {
            var newMsgId = Store.Msg.models[0].__x_id.clone();

            newMsgId.fromMe = true;
            newMsgId.id = WAPI.getNewId().toUpperCase();
            newMsgId.remote = chatId;
            newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`

            return newMsgId;
        };

        /**
         * Send Customized VCard without the necessity of contact be a Whatsapp Contact
         *
         * @param {string} chatId '000000000000@c.us'
         * @param {object|array} vcard { displayName: 'Contact Name', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name;;;\nEND:VCARD' } | [{ displayName: 'Contact Name 1', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 1;;;\nEND:VCARD' }, { displayName: 'Contact Name 2', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 2;;;\nEND:VCARD' }]
         */
        window.WAPI.sendVCard = function(chatId, vcard) {
            var chat = Store.Chat.get(chatId);
            var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe)[0]);
            var newId = window.WAPI.getNewMessageId(chatId);

            var extend = {
                ack: 0,
                id: newId,
                local: !0,
                self: "out",
                t: parseInt(new Date().getTime() / 1000),
                to: chatId,
                isNewMsg: !0,
            };

            if (Array.isArray(vcard)) {
                Object.assign(extend, {
                    type: "multi_vcard",
                    vcardList: vcard
                });

                delete extend.body;
            } else {
                Object.assign(extend, {
                    type: "vcard",
                    subtype: vcard.displayName,
                    body: vcard.vcard
                });

                delete extend.vcardList;
            }

            Object.assign(tempMsg, extend);

            chat.addAndSendMsg(tempMsg);
        };
        /**
         * Block contact
         * @param {string} id '000000000000@c.us'
         * @param {*} done - function - Callback function to be called when a new message arrives.
         */
        window.WAPI.contactBlock = function(id, done) {
                const contact = window.Store.Contact.get(id);
                if (contact !== undefined) {
                    contact.setBlock(!0);
                    done(true);
                    return true;
                }
                done(false);
                return false;
            }
            /**
             * unBlock contact
             * @param {string} id '000000000000@c.us'
             * @param {*} done - function - Callback function to be called when a new message arrives.
             */
        window.WAPI.contactUnblock = function(id, done) {
            const contact = window.Store.Contact.get(id);
            if (contact !== undefined) {
                contact.setBlock(!1);
                done(true);
                return true;
            }
            done(false);
            return false;
        }

        /**
         * Remove participant of Group
         * @param {*} idGroup '0000000000-00000000@g.us'
         * @param {*} idParticipant '000000000000@c.us'
         * @param {*} done - function - Callback function to be called when a new message arrives.
         */
        window.WAPI.removeParticipantGroup = function(idGroup, idParticipant, done) {
            window.Store.WapQuery.removeParticipants(idGroup, [idParticipant]).then(() => {
                const metaDataGroup = window.Store.GroupMetadata.get(id)
                checkParticipant = metaDataGroup.participants._index[idParticipant];
                if (checkParticipant === undefined) {
                    done(true);
                    return true;
                }
            })
        }

        /**
         * Promote Participant to Admin in Group
         * @param {*} idGroup '0000000000-00000000@g.us'
         * @param {*} idParticipant '000000000000@c.us'
         * @param {*} done - function - Callback function to be called when a new message arrives.
         */
        window.WAPI.promoteParticipantAdminGroup = function(idGroup, idParticipant, done) {
            window.Store.WapQuery.promoteParticipants(idGroup, [idParticipant]).then(() => {
                const metaDataGroup = window.Store.GroupMetadata.get(id)
                checkParticipant = metaDataGroup.participants._index[idParticipant];
                if (checkParticipant !== undefined && checkParticipant.isAdmin) {
                    done(true);
                    return true;
                }
                done(false);
                return false;
            })
        }

        /**
         * Demote Admin of Group
         * @param {*} idGroup '0000000000-00000000@g.us'
         * @param {*} idParticipant '000000000000@c.us'
         * @param {*} done - function - Callback function to be called when a new message arrives.
         */
        window.WAPI.demoteParticipantAdminGroup = function(idGroup, idParticipant, done) {
            window.Store.WapQuery.demoteParticipants(idGroup, [idParticipant]).then(() => {
                const metaDataGroup = window.Store.GroupMetadata.get(id)
                if (metaDataGroup === undefined) {
                    done(false);
                    return false;
                }
                checkParticipant = metaDataGroup.participants._index[idParticipant];
                if (checkParticipant !== undefined && checkParticipant.isAdmin) {
                    done(false);
                    return false;
                }
                done(true);
                return true;
            })
        }

        window.WAPI.procFiles = async function(chat, blobs) {
            if (!Array.isArray(blobs)) {
                blobs = [blobs];
            }
            var mc = new Store.MediaCollection(chat);
            await mc.processFiles((Debug.VERSION === '0.4.613') ? blobs : blobs.map(blob => { return { file: blob } }), chat, 1);
            return mc
        }

        /* Function to return Given ID is exists or not */
        window.WAPI.isChatOpened = function(id) {
            try {
                window.WAPI.getChatById(id);
                return true;
            } catch (ex) {
                return false;
            }
        }

        clearInterval(ref);
        console.log("Shell Loaded", WAPI);

    } catch (ex) {
        console.log(ex);
    }
}


let ref = setInterval(() => {
    prepareWindowStore();
}, 500);

document.addEventListener(EVENT_NAME, function(e) {
    try {
        // var file = WAPI.base64ImageToFile(e.detail.file, e.detail.fileName);
        let result = WAPI.sendImage(e.detail.file, e.detail.toNumber + '@c.us', e.detail.fileName, e.detail.caption);
    } catch (ex) {
        console.log(ex);
    }
});


document.addEventListener(GROUP_GRAB, function(e) {
    try {
        WAPI.getGroupMetadata(e.detail).then(value => {
            var displayContact = [];
            var displayNames = [];
            for (var i = 0; i < value.participants._models.length; i++) {
                if (value.participants._models[i].__x_contact.__x_pushname) {
                    displayNames.push(value.participants._models[i].__x_contact.__x_pushname)
                } else if (value.participants._models[i].__x_contact.__x_displayName) {
                    displayNames.push(value.participants._models[i].__x_contact.__x_displayName)
                } else {
                    displayNames.push(" ")
                }
                displayContact.push(value.participants._models[i].__x_contact.__x_id)
            }
            document.dispatchEvent(new CustomEvent(GROUP_GRAB_CONTACT, { detail: [{ "data": displayContact, "name": displayNames }] }));
        });
    } catch (ex) {
        console.log(ex);
    }
});

document.addEventListener(MESSAGE_EVENT_NAME, async function(e) {
    try {
        // let result = WAPI.sendMessageToID(e.detail.toNumber,e.detail.message);    
        // if(!result)    {
        let result = WAPI.sendMessageToID(e.detail.toNumber + '@c.us', e.detail.messageText);
        if(!result){
            console.log(!result);  
        }
        // }

    } catch (ex) {
        console.log(ex);
    }
});

document.addEventListener(TEMPLATE_MESSAGE, async function(e) {
    try {
        if(e.detail.templateImage){
            let result = WAPI.sendFileTemplate(e.detail.toNumber + '@c.us',e.detail.templateImage, e.detail.messageText, e.detail.template, e.detail.messageText);
        }else{
            let result = WAPI.sendButtons(e.detail.toNumber + '@c.us', e.detail.messageText, e.detail.template, e.detail.messageText);
        }
    } catch (ex) {
        console.log(ex);
    }
});

document.addEventListener(LIST_MESSAGE, async function(e) {
    try {
        debugger;
        let result = WAPI.sendList(e.detail.toNumber + '@c.us',e.detail.buttonText, e.detail.description,e.detail.sections);
    } catch (ex) {
        console.log(ex);
    }
});


document.addEventListener(CAPTURE_PHONE_NUMBER_EVENT_NAME, function(e) {
    try {
        let result = WAPI.isChatOpened(e.detail.toNumber);
        let data = {
            index: e.detail.index,
            isValid: result
        };
        document.dispatchEvent(new CustomEvent(VALID_STATUS_PHONE_NUMBER_EVENT_NAME, { detail: data }));
    } catch (ex) {
        console.log(ex);
    }
});

document.addEventListener(VALID_BEFORE_SENDING, function(e) {
    try {
        let result = WAPI.isChatOpened(e.detail.chatid);
        let data = {
            toNumber: e.detail.toNumber,
            messageText: e.detail.messageText,
            isMediaMessage: e.detail.isMediaMessage,
            attachment_status: e.detail.attachment_status,
            caption: e.detail.caption,
            total_attachment: e.detail.total_attachment,
            attachment_type: e.detail.attachment_type,
            isValid: result
        };
        document.dispatchEvent(new CustomEvent(VALID_AFTER_SENDING, { detail: data }));
    } catch (ex) {
        console.log(ex);
    }
});


/*! For license information please see wppconnect-wa.js.LICENSE.txt */ ! function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.WPP = t() : e.WPP = t()
}(self, (() => (() => {
    var __webpack_modules__ = {
            9742: (e, t) => {
                "use strict";
                t.byteLength = function(e) {
                    var t = u(e),
                        r = t[0],
                        n = t[1];
                    return 3 * (r + n) / 4 - n
                }, t.toByteArray = function(e) {
                    var t, r, i = u(e),
                        s = i[0],
                        a = i[1],
                        c = new o(function(e, t, r) {
                            return 3 * (t + r) / 4 - r
                        }(0, s, a)),
                        l = 0,
                        d = a > 0 ? s - 4 : s;
                    for (r = 0; r < d; r += 4) t = n[e.charCodeAt(r)] << 18 | n[e.charCodeAt(r + 1)] << 12 | n[e.charCodeAt(r + 2)] << 6 | n[e.charCodeAt(r + 3)], c[l++] = t >> 16 & 255, c[l++] = t >> 8 & 255, c[l++] = 255 & t;
                    return 2 === a && (t = n[e.charCodeAt(r)] << 2 | n[e.charCodeAt(r + 1)] >> 4, c[l++] = 255 & t), 1 === a && (t = n[e.charCodeAt(r)] << 10 | n[e.charCodeAt(r + 1)] << 4 | n[e.charCodeAt(r + 2)] >> 2, c[l++] = t >> 8 & 255, c[l++] = 255 & t), c
                }, t.fromByteArray = function(e) {
                    for (var t, n = e.length, o = n % 3, i = [], s = 16383, a = 0, u = n - o; a < u; a += s) i.push(c(e, a, a + s > u ? u : a + s));
                    return 1 === o ? (t = e[n - 1], i.push(r[t >> 2] + r[t << 4 & 63] + "==")) : 2 === o && (t = (e[n - 2] << 8) + e[n - 1], i.push(r[t >> 10] + r[t >> 4 & 63] + r[t << 2 & 63] + "=")), i.join("")
                };
                for (var r = [], n = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, a = i.length; s < a; ++s) r[s] = i[s], n[i.charCodeAt(s)] = s;

                function u(e) {
                    var t = e.length;
                    if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                    var r = e.indexOf("=");
                    return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4]
                }

                function c(e, t, n) {
                    for (var o, i, s = [], a = t; a < n; a += 3) o = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]), s.push(r[(i = o) >> 18 & 63] + r[i >> 12 & 63] + r[i >> 6 & 63] + r[63 & i]);
                    return s.join("")
                }
                n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63
            },
            8764: (e, t, r) => {
                "use strict";
                const n = r(9742),
                    o = r(645),
                    i = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
                t.Buffer = u, t.SlowBuffer = function(e) {
                    return +e != e && (e = 0), u.alloc(+e)
                }, t.INSPECT_MAX_BYTES = 50;
                const s = 2147483647;

                function a(e) {
                    if (e > s) throw new RangeError('The value "' + e + '" is invalid for option "size"');
                    const t = new Uint8Array(e);
                    return Object.setPrototypeOf(t, u.prototype), t
                }

                function u(e, t, r) {
                    if ("number" == typeof e) {
                        if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
                        return d(e)
                    }
                    return c(e, t, r)
                }

                function c(e, t, r) {
                    if ("string" == typeof e) return function(e, t) {
                        if ("string" == typeof t && "" !== t || (t = "utf8"), !u.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
                        const r = 0 | h(e, t);
                        let n = a(r);
                        const o = n.write(e, t);
                        return o !== r && (n = n.slice(0, o)), n
                    }(e, t);
                    if (ArrayBuffer.isView(e)) return function(e) {
                        if (Y(e, Uint8Array)) {
                            const t = new Uint8Array(e);
                            return p(t.buffer, t.byteOffset, t.byteLength)
                        }
                        return f(e)
                    }(e);
                    if (null == e) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
                    if (Y(e, ArrayBuffer) || e && Y(e.buffer, ArrayBuffer)) return p(e, t, r);
                    if ("undefined" != typeof SharedArrayBuffer && (Y(e, SharedArrayBuffer) || e && Y(e.buffer, SharedArrayBuffer))) return p(e, t, r);
                    if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');
                    const n = e.valueOf && e.valueOf();
                    if (null != n && n !== e) return u.from(n, t, r);
                    const o = function(e) {
                        if (u.isBuffer(e)) {
                            const t = 0 | m(e.length),
                                r = a(t);
                            return 0 === r.length || e.copy(r, 0, 0, t), r
                        }
                        return void 0 !== e.length ? "number" != typeof e.length || H(e.length) ? a(0) : f(e) : "Buffer" === e.type && Array.isArray(e.data) ? f(e.data) : void 0
                    }(e);
                    if (o) return o;
                    if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return u.from(e[Symbol.toPrimitive]("string"), t, r);
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
                }

                function l(e) {
                    if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
                    if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"')
                }

                function d(e) {
                    return l(e), a(e < 0 ? 0 : 0 | m(e))
                }

                function f(e) {
                    const t = e.length < 0 ? 0 : 0 | m(e.length),
                        r = a(t);
                    for (let n = 0; n < t; n += 1) r[n] = 255 & e[n];
                    return r
                }

                function p(e, t, r) {
                    if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
                    if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
                    let n;
                    return n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r), Object.setPrototypeOf(n, u.prototype), n
                }

                function m(e) {
                    if (e >= s) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s.toString(16) + " bytes");
                    return 0 | e
                }

                function h(e, t) {
                    if (u.isBuffer(e)) return e.length;
                    if (ArrayBuffer.isView(e) || Y(e, ArrayBuffer)) return e.byteLength;
                    if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
                    const r = e.length,
                        n = arguments.length > 2 && !0 === arguments[2];
                    if (!n && 0 === r) return 0;
                    let o = !1;
                    for (;;) switch (t) {
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return r;
                        case "utf8":
                        case "utf-8":
                            return K(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * r;
                        case "hex":
                            return r >>> 1;
                        case "base64":
                            return V(e).length;
                        default:
                            if (o) return n ? -1 : K(e).length;
                            t = ("" + t).toLowerCase(), o = !0
                    }
                }

                function g(e, t, r) {
                    let n = !1;
                    if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                    if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                    if ((r >>>= 0) <= (t >>>= 0)) return "";
                    for (e || (e = "utf8");;) switch (e) {
                        case "hex":
                            return E(this, t, r);
                        case "utf8":
                        case "utf-8":
                            return x(this, t, r);
                        case "ascii":
                            return S(this, t, r);
                        case "latin1":
                        case "binary":
                            return I(this, t, r);
                        case "base64":
                            return j(this, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return k(this, t, r);
                        default:
                            if (n) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase(), n = !0
                    }
                }

                function y(e, t, r) {
                    const n = e[t];
                    e[t] = e[r], e[r] = n
                }

                function b(e, t, r, n, o) {
                    if (0 === e.length) return -1;
                    if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), H(r = +r) && (r = o ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                        if (o) return -1;
                        r = e.length - 1
                    } else if (r < 0) {
                        if (!o) return -1;
                        r = 0
                    }
                    if ("string" == typeof t && (t = u.from(t, n)), u.isBuffer(t)) return 0 === t.length ? -1 : v(e, t, r, n, o);
                    if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : v(e, [t], r, n, o);
                    throw new TypeError("val must be string, number or Buffer")
                }

                function v(e, t, r, n, o) {
                    let i, s = 1,
                        a = e.length,
                        u = t.length;
                    if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                        if (e.length < 2 || t.length < 2) return -1;
                        s = 2, a /= 2, u /= 2, r /= 2
                    }

                    function c(e, t) {
                        return 1 === s ? e[t] : e.readUInt16BE(t * s)
                    }
                    if (o) {
                        let n = -1;
                        for (i = r; i < a; i++)
                            if (c(e, i) === c(t, -1 === n ? 0 : i - n)) {
                                if (-1 === n && (n = i), i - n + 1 === u) return n * s
                            } else -1 !== n && (i -= i - n), n = -1
                    } else
                        for (r + u > a && (r = a - u), i = r; i >= 0; i--) {
                            let r = !0;
                            for (let n = 0; n < u; n++)
                                if (c(e, i + n) !== c(t, n)) {
                                    r = !1;
                                    break
                                }
                            if (r) return i
                        }
                    return -1
                }

                function _(e, t, r, n) {
                    r = Number(r) || 0;
                    const o = e.length - r;
                    n ? (n = Number(n)) > o && (n = o) : n = o;
                    const i = t.length;
                    let s;
                    for (n > i / 2 && (n = i / 2), s = 0; s < n; ++s) {
                        const n = parseInt(t.substr(2 * s, 2), 16);
                        if (H(n)) return s;
                        e[r + s] = n
                    }
                    return s
                }

                function M(e, t, r, n) {
                    return Q(K(t, e.length - r), e, r, n)
                }

                function w(e, t, r, n) {
                    return Q(function(e) {
                        const t = [];
                        for (let r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                        return t
                    }(t), e, r, n)
                }

                function P(e, t, r, n) {
                    return Q(V(t), e, r, n)
                }

                function O(e, t, r, n) {
                    return Q(function(e, t) {
                        let r, n, o;
                        const i = [];
                        for (let s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), n = r >> 8, o = r % 256, i.push(o), i.push(n);
                        return i
                    }(t, e.length - r), e, r, n)
                }

                function j(e, t, r) {
                    return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r))
                }

                function x(e, t, r) {
                    r = Math.min(e.length, r);
                    const n = [];
                    let o = t;
                    for (; o < r;) {
                        const t = e[o];
                        let i = null,
                            s = t > 239 ? 4 : t > 223 ? 3 : t > 191 ? 2 : 1;
                        if (o + s <= r) {
                            let r, n, a, u;
                            switch (s) {
                                case 1:
                                    t < 128 && (i = t);
                                    break;
                                case 2:
                                    r = e[o + 1], 128 == (192 & r) && (u = (31 & t) << 6 | 63 & r, u > 127 && (i = u));
                                    break;
                                case 3:
                                    r = e[o + 1], n = e[o + 2], 128 == (192 & r) && 128 == (192 & n) && (u = (15 & t) << 12 | (63 & r) << 6 | 63 & n, u > 2047 && (u < 55296 || u > 57343) && (i = u));
                                    break;
                                case 4:
                                    r = e[o + 1], n = e[o + 2], a = e[o + 3], 128 == (192 & r) && 128 == (192 & n) && 128 == (192 & a) && (u = (15 & t) << 18 | (63 & r) << 12 | (63 & n) << 6 | 63 & a, u > 65535 && u < 1114112 && (i = u))
                            }
                        }
                        null === i ? (i = 65533, s = 1) : i > 65535 && (i -= 65536, n.push(i >>> 10 & 1023 | 55296), i = 56320 | 1023 & i), n.push(i), o += s
                    }
                    return function(e) {
                        const t = e.length;
                        if (t <= C) return String.fromCharCode.apply(String, e);
                        let r = "",
                            n = 0;
                        for (; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += C));
                        return r
                    }(n)
                }
                t.kMaxLength = s, u.TYPED_ARRAY_SUPPORT = function() {
                    try {
                        const e = new Uint8Array(1),
                            t = {
                                foo: function() {
                                    return 42
                                }
                            };
                        return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), 42 === e.foo()
                    } catch (e) {
                        return !1
                    }
                }(), u.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(u.prototype, "parent", {
                    enumerable: !0,
                    get: function() {
                        if (u.isBuffer(this)) return this.buffer
                    }
                }), Object.defineProperty(u.prototype, "offset", {
                    enumerable: !0,
                    get: function() {
                        if (u.isBuffer(this)) return this.byteOffset
                    }
                }), u.poolSize = 8192, u.from = function(e, t, r) {
                    return c(e, t, r)
                }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array), u.alloc = function(e, t, r) {
                    return function(e, t, r) {
                        return l(e), e <= 0 ? a(e) : void 0 !== t ? "string" == typeof r ? a(e).fill(t, r) : a(e).fill(t) : a(e)
                    }(e, t, r)
                }, u.allocUnsafe = function(e) {
                    return d(e)
                }, u.allocUnsafeSlow = function(e) {
                    return d(e)
                }, u.isBuffer = function(e) {
                    return null != e && !0 === e._isBuffer && e !== u.prototype
                }, u.compare = function(e, t) {
                    if (Y(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)), Y(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)), !u.isBuffer(e) || !u.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                    if (e === t) return 0;
                    let r = e.length,
                        n = t.length;
                    for (let o = 0, i = Math.min(r, n); o < i; ++o)
                        if (e[o] !== t[o]) {
                            r = e[o], n = t[o];
                            break
                        }
                    return r < n ? -1 : n < r ? 1 : 0
                }, u.isEncoding = function(e) {
                    switch (String(e).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "latin1":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1
                    }
                }, u.concat = function(e, t) {
                    if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                    if (0 === e.length) return u.alloc(0);
                    let r;
                    if (void 0 === t)
                        for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
                    const n = u.allocUnsafe(t);
                    let o = 0;
                    for (r = 0; r < e.length; ++r) {
                        let t = e[r];
                        if (Y(t, Uint8Array)) o + t.length > n.length ? (u.isBuffer(t) || (t = u.from(t)), t.copy(n, o)) : Uint8Array.prototype.set.call(n, t, o);
                        else {
                            if (!u.isBuffer(t)) throw new TypeError('"list" argument must be an Array of Buffers');
                            t.copy(n, o)
                        }
                        o += t.length
                    }
                    return n
                }, u.byteLength = h, u.prototype._isBuffer = !0, u.prototype.swap16 = function() {
                    const e = this.length;
                    if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                    for (let t = 0; t < e; t += 2) y(this, t, t + 1);
                    return this
                }, u.prototype.swap32 = function() {
                    const e = this.length;
                    if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                    for (let t = 0; t < e; t += 4) y(this, t, t + 3), y(this, t + 1, t + 2);
                    return this
                }, u.prototype.swap64 = function() {
                    const e = this.length;
                    if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                    for (let t = 0; t < e; t += 8) y(this, t, t + 7), y(this, t + 1, t + 6), y(this, t + 2, t + 5), y(this, t + 3, t + 4);
                    return this
                }, u.prototype.toString = function() {
                    const e = this.length;
                    return 0 === e ? "" : 0 === arguments.length ? x(this, 0, e) : g.apply(this, arguments)
                }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(e) {
                    if (!u.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    return this === e || 0 === u.compare(this, e)
                }, u.prototype.inspect = function() {
                    let e = "";
                    const r = t.INSPECT_MAX_BYTES;
                    return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">"
                }, i && (u.prototype[i] = u.prototype.inspect), u.prototype.compare = function(e, t, r, n, o) {
                    if (Y(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)), !u.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
                    if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === o && (o = this.length), t < 0 || r > e.length || n < 0 || o > this.length) throw new RangeError("out of range index");
                    if (n >= o && t >= r) return 0;
                    if (n >= o) return -1;
                    if (t >= r) return 1;
                    if (this === e) return 0;
                    let i = (o >>>= 0) - (n >>>= 0),
                        s = (r >>>= 0) - (t >>>= 0);
                    const a = Math.min(i, s),
                        c = this.slice(n, o),
                        l = e.slice(t, r);
                    for (let e = 0; e < a; ++e)
                        if (c[e] !== l[e]) {
                            i = c[e], s = l[e];
                            break
                        }
                    return i < s ? -1 : s < i ? 1 : 0
                }, u.prototype.includes = function(e, t, r) {
                    return -1 !== this.indexOf(e, t, r)
                }, u.prototype.indexOf = function(e, t, r) {
                    return b(this, e, t, r, !0)
                }, u.prototype.lastIndexOf = function(e, t, r) {
                    return b(this, e, t, r, !1)
                }, u.prototype.write = function(e, t, r, n) {
                    if (void 0 === t) n = "utf8", r = this.length, t = 0;
                    else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
                    else {
                        if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                        t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
                    }
                    const o = this.length - t;
                    if ((void 0 === r || r > o) && (r = o), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                    n || (n = "utf8");
                    let i = !1;
                    for (;;) switch (n) {
                        case "hex":
                            return _(this, e, t, r);
                        case "utf8":
                        case "utf-8":
                            return M(this, e, t, r);
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return w(this, e, t, r);
                        case "base64":
                            return P(this, e, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return O(this, e, t, r);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + n);
                            n = ("" + n).toLowerCase(), i = !0
                    }
                }, u.prototype.toJSON = function() {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                };
                const C = 4096;

                function S(e, t, r) {
                    let n = "";
                    r = Math.min(e.length, r);
                    for (let o = t; o < r; ++o) n += String.fromCharCode(127 & e[o]);
                    return n
                }

                function I(e, t, r) {
                    let n = "";
                    r = Math.min(e.length, r);
                    for (let o = t; o < r; ++o) n += String.fromCharCode(e[o]);
                    return n
                }

                function E(e, t, r) {
                    const n = e.length;
                    (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
                    let o = "";
                    for (let n = t; n < r; ++n) o += J[e[n]];
                    return o
                }

                function k(e, t, r) {
                    const n = e.slice(t, r);
                    let o = "";
                    for (let e = 0; e < n.length - 1; e += 2) o += String.fromCharCode(n[e] + 256 * n[e + 1]);
                    return o
                }

                function T(e, t, r) {
                    if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                    if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
                }

                function B(e, t, r, n, o, i) {
                    if (!u.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (t > o || t < i) throw new RangeError('"value" argument is out of bounds');
                    if (r + n > e.length) throw new RangeError("Index out of range")
                }

                function L(e, t, r, n, o) {
                    W(t, n, o, e, r, 7);
                    let i = Number(t & BigInt(4294967295));
                    e[r++] = i, i >>= 8, e[r++] = i, i >>= 8, e[r++] = i, i >>= 8, e[r++] = i;
                    let s = Number(t >> BigInt(32) & BigInt(4294967295));
                    return e[r++] = s, s >>= 8, e[r++] = s, s >>= 8, e[r++] = s, s >>= 8, e[r++] = s, r
                }

                function A(e, t, r, n, o) {
                    W(t, n, o, e, r, 7);
                    let i = Number(t & BigInt(4294967295));
                    e[r + 7] = i, i >>= 8, e[r + 6] = i, i >>= 8, e[r + 5] = i, i >>= 8, e[r + 4] = i;
                    let s = Number(t >> BigInt(32) & BigInt(4294967295));
                    return e[r + 3] = s, s >>= 8, e[r + 2] = s, s >>= 8, e[r + 1] = s, s >>= 8, e[r] = s, r + 8
                }

                function R(e, t, r, n, o, i) {
                    if (r + n > e.length) throw new RangeError("Index out of range");
                    if (r < 0) throw new RangeError("Index out of range")
                }

                function F(e, t, r, n, i) {
                    return t = +t, r >>>= 0, i || R(e, 0, r, 4), o.write(e, t, r, n, 23, 4), r + 4
                }

                function D(e, t, r, n, i) {
                    return t = +t, r >>>= 0, i || R(e, 0, r, 8), o.write(e, t, r, n, 52, 8), r + 8
                }
                u.prototype.slice = function(e, t) {
                    const r = this.length;
                    (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e);
                    const n = this.subarray(e, t);
                    return Object.setPrototypeOf(n, u.prototype), n
                }, u.prototype.readUintLE = u.prototype.readUIntLE = function(e, t, r) {
                    e >>>= 0, t >>>= 0, r || T(e, t, this.length);
                    let n = this[e],
                        o = 1,
                        i = 0;
                    for (; ++i < t && (o *= 256);) n += this[e + i] * o;
                    return n
                }, u.prototype.readUintBE = u.prototype.readUIntBE = function(e, t, r) {
                    e >>>= 0, t >>>= 0, r || T(e, t, this.length);
                    let n = this[e + --t],
                        o = 1;
                    for (; t > 0 && (o *= 256);) n += this[e + --t] * o;
                    return n
                }, u.prototype.readUint8 = u.prototype.readUInt8 = function(e, t) {
                    return e >>>= 0, t || T(e, 1, this.length), this[e]
                }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(e, t) {
                    return e >>>= 0, t || T(e, 2, this.length), this[e] | this[e + 1] << 8
                }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(e, t) {
                    return e >>>= 0, t || T(e, 2, this.length), this[e] << 8 | this[e + 1]
                }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(e, t) {
                    return e >>>= 0, t || T(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(e, t) {
                    return e >>>= 0, t || T(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                }, u.prototype.readBigUInt64LE = Z((function(e) {
                    z(e >>>= 0, "offset");
                    const t = this[e],
                        r = this[e + 7];
                    void 0 !== t && void 0 !== r || q(e, this.length - 8);
                    const n = t + 256 * this[++e] + 65536 * this[++e] + this[++e] * 2 ** 24,
                        o = this[++e] + 256 * this[++e] + 65536 * this[++e] + r * 2 ** 24;
                    return BigInt(n) + (BigInt(o) << BigInt(32))
                })), u.prototype.readBigUInt64BE = Z((function(e) {
                    z(e >>>= 0, "offset");
                    const t = this[e],
                        r = this[e + 7];
                    void 0 !== t && void 0 !== r || q(e, this.length - 8);
                    const n = t * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + this[++e],
                        o = this[++e] * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + r;
                    return (BigInt(n) << BigInt(32)) + BigInt(o)
                })), u.prototype.readIntLE = function(e, t, r) {
                    e >>>= 0, t >>>= 0, r || T(e, t, this.length);
                    let n = this[e],
                        o = 1,
                        i = 0;
                    for (; ++i < t && (o *= 256);) n += this[e + i] * o;
                    return o *= 128, n >= o && (n -= Math.pow(2, 8 * t)), n
                }, u.prototype.readIntBE = function(e, t, r) {
                    e >>>= 0, t >>>= 0, r || T(e, t, this.length);
                    let n = t,
                        o = 1,
                        i = this[e + --n];
                    for (; n > 0 && (o *= 256);) i += this[e + --n] * o;
                    return o *= 128, i >= o && (i -= Math.pow(2, 8 * t)), i
                }, u.prototype.readInt8 = function(e, t) {
                    return e >>>= 0, t || T(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
                }, u.prototype.readInt16LE = function(e, t) {
                    e >>>= 0, t || T(e, 2, this.length);
                    const r = this[e] | this[e + 1] << 8;
                    return 32768 & r ? 4294901760 | r : r
                }, u.prototype.readInt16BE = function(e, t) {
                    e >>>= 0, t || T(e, 2, this.length);
                    const r = this[e + 1] | this[e] << 8;
                    return 32768 & r ? 4294901760 | r : r
                }, u.prototype.readInt32LE = function(e, t) {
                    return e >>>= 0, t || T(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                }, u.prototype.readInt32BE = function(e, t) {
                    return e >>>= 0, t || T(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                }, u.prototype.readBigInt64LE = Z((function(e) {
                    z(e >>>= 0, "offset");
                    const t = this[e],
                        r = this[e + 7];
                    void 0 !== t && void 0 !== r || q(e, this.length - 8);
                    const n = this[e + 4] + 256 * this[e + 5] + 65536 * this[e + 6] + (r << 24);
                    return (BigInt(n) << BigInt(32)) + BigInt(t + 256 * this[++e] + 65536 * this[++e] + this[++e] * 2 ** 24)
                })), u.prototype.readBigInt64BE = Z((function(e) {
                    z(e >>>= 0, "offset");
                    const t = this[e],
                        r = this[e + 7];
                    void 0 !== t && void 0 !== r || q(e, this.length - 8);
                    const n = (t << 24) + 65536 * this[++e] + 256 * this[++e] + this[++e];
                    return (BigInt(n) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + r)
                })), u.prototype.readFloatLE = function(e, t) {
                    return e >>>= 0, t || T(e, 4, this.length), o.read(this, e, !0, 23, 4)
                }, u.prototype.readFloatBE = function(e, t) {
                    return e >>>= 0, t || T(e, 4, this.length), o.read(this, e, !1, 23, 4)
                }, u.prototype.readDoubleLE = function(e, t) {
                    return e >>>= 0, t || T(e, 8, this.length), o.read(this, e, !0, 52, 8)
                }, u.prototype.readDoubleBE = function(e, t) {
                    return e >>>= 0, t || T(e, 8, this.length), o.read(this, e, !1, 52, 8)
                }, u.prototype.writeUintLE = u.prototype.writeUIntLE = function(e, t, r, n) {
                    e = +e, t >>>= 0, r >>>= 0, n || B(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                    let o = 1,
                        i = 0;
                    for (this[t] = 255 & e; ++i < r && (o *= 256);) this[t + i] = e / o & 255;
                    return t + r
                }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(e, t, r, n) {
                    e = +e, t >>>= 0, r >>>= 0, n || B(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                    let o = r - 1,
                        i = 1;
                    for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) this[t + o] = e / i & 255;
                    return t + r
                }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1
                }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
                }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
                }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4
                }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
                }, u.prototype.writeBigUInt64LE = Z((function(e, t = 0) {
                    return L(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"))
                })), u.prototype.writeBigUInt64BE = Z((function(e, t = 0) {
                    return A(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"))
                })), u.prototype.writeIntLE = function(e, t, r, n) {
                    if (e = +e, t >>>= 0, !n) {
                        const n = Math.pow(2, 8 * r - 1);
                        B(this, e, t, r, n - 1, -n)
                    }
                    let o = 0,
                        i = 1,
                        s = 0;
                    for (this[t] = 255 & e; ++o < r && (i *= 256);) e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / i >> 0) - s & 255;
                    return t + r
                }, u.prototype.writeIntBE = function(e, t, r, n) {
                    if (e = +e, t >>>= 0, !n) {
                        const n = Math.pow(2, 8 * r - 1);
                        B(this, e, t, r, n - 1, -n)
                    }
                    let o = r - 1,
                        i = 1,
                        s = 0;
                    for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / i >> 0) - s & 255;
                    return t + r
                }, u.prototype.writeInt8 = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                }, u.prototype.writeInt16LE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
                }, u.prototype.writeInt16BE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
                }, u.prototype.writeInt32LE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4
                }, u.prototype.writeInt32BE = function(e, t, r) {
                    return e = +e, t >>>= 0, r || B(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
                }, u.prototype.writeBigInt64LE = Z((function(e, t = 0) {
                    return L(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
                })), u.prototype.writeBigInt64BE = Z((function(e, t = 0) {
                    return A(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
                })), u.prototype.writeFloatLE = function(e, t, r) {
                    return F(this, e, t, !0, r)
                }, u.prototype.writeFloatBE = function(e, t, r) {
                    return F(this, e, t, !1, r)
                }, u.prototype.writeDoubleLE = function(e, t, r) {
                    return D(this, e, t, !0, r)
                }, u.prototype.writeDoubleBE = function(e, t, r) {
                    return D(this, e, t, !1, r)
                }, u.prototype.copy = function(e, t, r, n) {
                    if (!u.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                    if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
                    if (0 === e.length || 0 === this.length) return 0;
                    if (t < 0) throw new RangeError("targetStart out of bounds");
                    if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
                    if (n < 0) throw new RangeError("sourceEnd out of bounds");
                    n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
                    const o = n - r;
                    return this === e && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(t, r, n) : Uint8Array.prototype.set.call(e, this.subarray(r, n), t), o
                }, u.prototype.fill = function(e, t, r, n) {
                    if ("string" == typeof e) {
                        if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
                        if ("string" == typeof n && !u.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
                        if (1 === e.length) {
                            const t = e.charCodeAt(0);
                            ("utf8" === n && t < 128 || "latin1" === n) && (e = t)
                        }
                    } else "number" == typeof e ? e &= 255 : "boolean" == typeof e && (e = Number(e));
                    if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                    if (r <= t) return this;
                    let o;
                    if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e)
                        for (o = t; o < r; ++o) this[o] = e;
                    else {
                        const i = u.isBuffer(e) ? e : u.from(e, n),
                            s = i.length;
                        if (0 === s) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                        for (o = 0; o < r - t; ++o) this[o + t] = i[o % s]
                    }
                    return this
                };
                const U = {};

                function N(e, t, r) {
                    U[e] = class extends r {
                        constructor() {
                            super(), Object.defineProperty(this, "message", {
                                value: t.apply(this, arguments),
                                writable: !0,
                                configurable: !0
                            }), this.name = `${this.name} [${e}]`, this.stack, delete this.name
                        }
                        get code() {
                            return e
                        }
                        set code(e) {
                            Object.defineProperty(this, "code", {
                                configurable: !0,
                                enumerable: !0,
                                value: e,
                                writable: !0
                            })
                        }
                        toString() {
                            return `${this.name} [${e}]: ${this.message}`
                        }
                    }
                }

                function G(e) {
                    let t = "",
                        r = e.length;
                    const n = "-" === e[0] ? 1 : 0;
                    for (; r >= n + 4; r -= 3) t = `_${e.slice(r-3,r)}${t}`;
                    return `${e.slice(0,r)}${t}`
                }

                function W(e, t, r, n, o, i) {
                    if (e > r || e < t) {
                        const n = "bigint" == typeof t ? "n" : "";
                        let o;
                        throw o = i > 3 ? 0 === t || t === BigInt(0) ? `>= 0${n} and < 2${n} ** ${8*(i+1)}${n}` : `>= -(2${n} ** ${8*(i+1)-1}${n}) and < 2 ** ${8*(i+1)-1}${n}` : `>= ${t}${n} and <= ${r}${n}`, new U.ERR_OUT_OF_RANGE("value", o, e)
                    }! function(e, t, r) {
                        z(t, "offset"), void 0 !== e[t] && void 0 !== e[t + r] || q(t, e.length - (r + 1))
                    }(n, o, i)
                }

                function z(e, t) {
                    if ("number" != typeof e) throw new U.ERR_INVALID_ARG_TYPE(t, "number", e)
                }

                function q(e, t, r) {
                    if (Math.floor(e) !== e) throw z(e, r), new U.ERR_OUT_OF_RANGE(r || "offset", "an integer", e);
                    if (t < 0) throw new U.ERR_BUFFER_OUT_OF_BOUNDS;
                    throw new U.ERR_OUT_OF_RANGE(r || "offset", `>= ${r?1:0} and <= ${t}`, e)
                }
                N("ERR_BUFFER_OUT_OF_BOUNDS", (function(e) {
                    return e ? `${e} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds"
                }), RangeError), N("ERR_INVALID_ARG_TYPE", (function(e, t) {
                    return `The "${e}" argument must be of type number. Received type ${typeof t}`
                }), TypeError), N("ERR_OUT_OF_RANGE", (function(e, t, r) {
                    let n = `The value of "${e}" is out of range.`,
                        o = r;
                    return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? o = G(String(r)) : "bigint" == typeof r && (o = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (o = G(o)), o += "n"), n += ` It must be ${t}. Received ${o}`, n
                }), RangeError);
                const $ = /[^+/0-9A-Za-z-_]/g;

                function K(e, t) {
                    let r;
                    t = t || 1 / 0;
                    const n = e.length;
                    let o = null;
                    const i = [];
                    for (let s = 0; s < n; ++s) {
                        if (r = e.charCodeAt(s), r > 55295 && r < 57344) {
                            if (!o) {
                                if (r > 56319) {
                                    (t -= 3) > -1 && i.push(239, 191, 189);
                                    continue
                                }
                                if (s + 1 === n) {
                                    (t -= 3) > -1 && i.push(239, 191, 189);
                                    continue
                                }
                                o = r;
                                continue
                            }
                            if (r < 56320) {
                                (t -= 3) > -1 && i.push(239, 191, 189), o = r;
                                continue
                            }
                            r = 65536 + (o - 55296 << 10 | r - 56320)
                        } else o && (t -= 3) > -1 && i.push(239, 191, 189);
                        if (o = null, r < 128) {
                            if ((t -= 1) < 0) break;
                            i.push(r)
                        } else if (r < 2048) {
                            if ((t -= 2) < 0) break;
                            i.push(r >> 6 | 192, 63 & r | 128)
                        } else if (r < 65536) {
                            if ((t -= 3) < 0) break;
                            i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                        } else {
                            if (!(r < 1114112)) throw new Error("Invalid code point");
                            if ((t -= 4) < 0) break;
                            i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                        }
                    }
                    return i
                }

                function V(e) {
                    return n.toByteArray(function(e) {
                        if ((e = (e = e.split("=")[0]).trim().replace($, "")).length < 2) return "";
                        for (; e.length % 4 != 0;) e += "=";
                        return e
                    }(e))
                }

                function Q(e, t, r, n) {
                    let o;
                    for (o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o) t[o + r] = e[o];
                    return o
                }

                function Y(e, t) {
                    return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
                }

                function H(e) {
                    return e != e
                }
                const J = function() {
                    const e = "0123456789abcdef",
                        t = new Array(256);
                    for (let r = 0; r < 16; ++r) {
                        const n = 16 * r;
                        for (let o = 0; o < 16; ++o) t[n + o] = e[r] + e[o]
                    }
                    return t
                }();

                function Z(e) {
                    return "undefined" == typeof BigInt ? X : e
                }

                function X() {
                    throw new Error("BigInt not supported")
                }
            },
            1227: (e, t, r) => {
                t.formatArgs = function(t) {
                    if (t[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + t[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors) return;
                    const r = "color: " + this.color;
                    t.splice(1, 0, r, "color: inherit");
                    let n = 0,
                        o = 0;
                    t[0].replace(/%[a-zA-Z%]/g, (e => {
                        "%%" !== e && (n++, "%c" === e && (o = n))
                    })), t.splice(o, 0, r)
                }, t.save = function(e) {
                    try {
                        e ? t.storage.setItem("debug", e) : t.storage.removeItem("debug")
                    } catch (e) {}
                }, t.load = function() {
                    let e;
                    try {
                        e = t.storage.getItem("debug")
                    } catch (e) {}
                    return !e && "undefined" != typeof process && "env" in process && (e = process.env.DEBUG), e
                }, t.useColors = function() {
                    return !("undefined" == typeof window || !window.process || "renderer" !== window.process.type && !window.process.__nwjs) || ("undefined" == typeof navigator || !navigator.userAgent || !navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) && ("undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
                }, t.storage = function() {
                    try {
                        return localStorage
                    } catch (e) {}
                }(), t.destroy = (() => {
                    let e = !1;
                    return () => {
                        e || (e = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))
                    }
                })(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], t.log = console.debug || console.log || (() => {}), e.exports = r(2447)(t);
                const {
                    formatters: n
                } = e.exports;
                n.j = function(e) {
                    try {
                        return JSON.stringify(e)
                    } catch (e) {
                        return "[UnexpectedJSONParseError]: " + e.message
                    }
                }
            },
            2447: (e, t, r) => {
                e.exports = function(e) {
                    function t(e) {
                        let r, o, i, s = null;

                        function a(...e) {
                            if (!a.enabled) return;
                            const n = a,
                                o = Number(new Date),
                                i = o - (r || o);
                            n.diff = i, n.prev = r, n.curr = o, r = o, e[0] = t.coerce(e[0]), "string" != typeof e[0] && e.unshift("%O");
                            let s = 0;
                            e[0] = e[0].replace(/%([a-zA-Z%])/g, ((r, o) => {
                                if ("%%" === r) return "%";
                                s++;
                                const i = t.formatters[o];
                                if ("function" == typeof i) {
                                    const t = e[s];
                                    r = i.call(n, t), e.splice(s, 1), s--
                                }
                                return r
                            })), t.formatArgs.call(n, e), (n.log || t.log).apply(n, e)
                        }
                        return a.namespace = e, a.useColors = t.useColors(), a.color = t.selectColor(e), a.extend = n, a.destroy = t.destroy, Object.defineProperty(a, "enabled", {
                            enumerable: !0,
                            configurable: !1,
                            get: () => null !== s ? s : (o !== t.namespaces && (o = t.namespaces, i = t.enabled(e)), i),
                            set: e => {
                                s = e
                            }
                        }), "function" == typeof t.init && t.init(a), a
                    }

                    function n(e, r) {
                        const n = t(this.namespace + (void 0 === r ? ":" : r) + e);
                        return n.log = this.log, n
                    }

                    function o(e) {
                        return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*")
                    }
                    return t.debug = t, t.default = t, t.coerce = function(e) {
                        return e instanceof Error ? e.stack || e.message : e
                    }, t.disable = function() {
                        const e = [...t.names.map(o), ...t.skips.map(o).map((e => "-" + e))].join(",");
                        return t.enable(""), e
                    }, t.enable = function(e) {
                        let r;
                        t.save(e), t.namespaces = e, t.names = [], t.skips = [];
                        const n = ("string" == typeof e ? e : "").split(/[\s,]+/),
                            o = n.length;
                        for (r = 0; r < o; r++) n[r] && ("-" === (e = n[r].replace(/\*/g, ".*?"))[0] ? t.skips.push(new RegExp("^" + e.slice(1) + "$")) : t.names.push(new RegExp("^" + e + "$")))
                    }, t.enabled = function(e) {
                        if ("*" === e[e.length - 1]) return !0;
                        let r, n;
                        for (r = 0, n = t.skips.length; r < n; r++)
                            if (t.skips[r].test(e)) return !1;
                        for (r = 0, n = t.names.length; r < n; r++)
                            if (t.names[r].test(e)) return !0;
                        return !1
                    }, t.humanize = r(7824), t.destroy = function() {
                        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")
                    }, Object.keys(e).forEach((r => {
                        t[r] = e[r]
                    })), t.names = [], t.skips = [], t.formatters = {}, t.selectColor = function(e) {
                        let r = 0;
                        for (let t = 0; t < e.length; t++) r = (r << 5) - r + e.charCodeAt(t), r |= 0;
                        return t.colors[Math.abs(r) % t.colors.length]
                    }, t.enable(t.load()), t
                }
            },
            6387: (e, t, r) => {
                var n;
                ! function(o) {
                    var i = Object.hasOwnProperty,
                        s = Array.isArray ? Array.isArray : function(e) {
                            return "[object Array]" === Object.prototype.toString.call(e)
                        },
                        a = "object" == typeof process && "function" == typeof process.nextTick,
                        u = "function" == typeof Symbol,
                        c = "object" == typeof Reflect,
                        l = "function" == typeof setImmediate ? setImmediate : setTimeout,
                        d = u ? c && "function" == typeof Reflect.ownKeys ? Reflect.ownKeys : function(e) {
                            var t = Object.getOwnPropertyNames(e);
                            return t.push.apply(t, Object.getOwnPropertySymbols(e)), t
                        } : Object.keys;

                    function f() {
                        this._events = {}, this._conf && p.call(this, this._conf)
                    }

                    function p(e) {
                        e && (this._conf = e, e.delimiter && (this.delimiter = e.delimiter), e.maxListeners !== o && (this._maxListeners = e.maxListeners), e.wildcard && (this.wildcard = e.wildcard), e.newListener && (this._newListener = e.newListener), e.removeListener && (this._removeListener = e.removeListener), e.verboseMemoryLeak && (this.verboseMemoryLeak = e.verboseMemoryLeak), e.ignoreErrors && (this.ignoreErrors = e.ignoreErrors), this.wildcard && (this.listenerTree = {}))
                    }

                    function m(e, t) {
                        var r = "(node) warning: possible EventEmitter memory leak detected. " + e + " listeners added. Use emitter.setMaxListeners() to increase limit.";
                        if (this.verboseMemoryLeak && (r += " Event name: " + t + "."), "undefined" != typeof process && process.emitWarning) {
                            var n = new Error(r);
                            n.name = "MaxListenersExceededWarning", n.emitter = this, n.count = e, process.emitWarning(n)
                        } else console.error(r), console.trace && console.trace()
                    }
                    var h = function(e, t, r) {
                        var n = arguments.length;
                        switch (n) {
                            case 0:
                                return [];
                            case 1:
                                return [e];
                            case 2:
                                return [e, t];
                            case 3:
                                return [e, t, r];
                            default:
                                for (var o = new Array(n); n--;) o[n] = arguments[n];
                                return o
                        }
                    };

                    function g(e, t) {
                        for (var r = {}, n = e.length, i = t ? value.length : 0, s = 0; s < n; s++) r[e[s]] = s < i ? t[s] : o;
                        return r
                    }

                    function y(e, t, r) {
                        var n, o;
                        if (this._emitter = e, this._target = t, this._listeners = {}, this._listenersCount = 0, (r.on || r.off) && (n = r.on, o = r.off), t.addEventListener ? (n = t.addEventListener, o = t.removeEventListener) : t.addListener ? (n = t.addListener, o = t.removeListener) : t.on && (n = t.on, o = t.off), !n && !o) throw Error("target does not implement any known event API");
                        if ("function" != typeof n) throw TypeError("on method must be a function");
                        if ("function" != typeof o) throw TypeError("off method must be a function");
                        this._on = n, this._off = o;
                        var i = e._observers;
                        i ? i.push(this) : e._observers = [this]
                    }

                    function b(e, t, r, n) {
                        var s = Object.assign({}, t);
                        if (!e) return s;
                        if ("object" != typeof e) throw TypeError("options must be an object");
                        var a, u, c, l = Object.keys(e),
                            d = l.length;

                        function f(e) {
                            throw Error('Invalid "' + a + '" option value' + (e ? ". Reason: " + e : ""))
                        }
                        for (var p = 0; p < d; p++) {
                            if (a = l[p], !n && !i.call(t, a)) throw Error('Unknown "' + a + '" option');
                            (u = e[a]) !== o && (c = r[a], s[a] = c ? c(u, f) : u)
                        }
                        return s
                    }

                    function v(e, t) {
                        return "function" == typeof e && e.hasOwnProperty("prototype") || t("value must be a constructor"), e
                    }

                    function _(e) {
                        var t = "value must be type of " + e.join("|"),
                            r = e.length,
                            n = e[0],
                            o = e[1];
                        return 1 === r ? function(e, r) {
                            if (typeof e === n) return e;
                            r(t)
                        } : 2 === r ? function(e, r) {
                            var i = typeof e;
                            if (i === n || i === o) return e;
                            r(t)
                        } : function(n, o) {
                            for (var i = typeof n, s = r; s-- > 0;)
                                if (i === e[s]) return n;
                            o(t)
                        }
                    }
                    Object.assign(y.prototype, {
                        subscribe: function(e, t, r) {
                            var n = this,
                                o = this._target,
                                i = this._emitter,
                                s = this._listeners,
                                a = function() {
                                    var n = h.apply(null, arguments),
                                        s = {
                                            data: n,
                                            name: t,
                                            original: e
                                        };
                                    if (r) {
                                        var a = r.call(o, s);
                                        !1 !== a && i.emit.apply(i, [s.name].concat(n))
                                    } else i.emit.apply(i, [t].concat(n))
                                };
                            if (s[e]) throw Error("Event '" + e + "' is already listening");
                            this._listenersCount++, i._newListener && i._removeListener && !n._onNewListener ? (this._onNewListener = function(r) {
                                r === t && null === s[e] && (s[e] = a, n._on.call(o, e, a))
                            }, i.on("newListener", this._onNewListener), this._onRemoveListener = function(r) {
                                r === t && !i.hasListeners(r) && s[e] && (s[e] = null, n._off.call(o, e, a))
                            }, s[e] = null, i.on("removeListener", this._onRemoveListener)) : (s[e] = a, n._on.call(o, e, a))
                        },
                        unsubscribe: function(e) {
                            var t, r, n, o = this,
                                i = this._listeners,
                                s = this._emitter,
                                a = this._off,
                                u = this._target;
                            if (e && "string" != typeof e) throw TypeError("event must be a string");

                            function c() {
                                o._onNewListener && (s.off("newListener", o._onNewListener), s.off("removeListener", o._onRemoveListener), o._onNewListener = null, o._onRemoveListener = null);
                                var e = O.call(s, o);
                                s._observers.splice(e, 1)
                            }
                            if (e) {
                                if (!(t = i[e])) return;
                                a.call(u, e, t), delete i[e], --this._listenersCount || c()
                            } else {
                                for (n = (r = d(i)).length; n-- > 0;) e = r[n], a.call(u, e, i[e]);
                                this._listeners = {}, this._listenersCount = 0, c()
                            }
                        }
                    });
                    var M = _(["function"]),
                        w = _(["object", "function"]);

                    function P(e, t, r) {
                        var n, o, i, s = 0,
                            a = new e((function(u, c, l) {
                                function d() {
                                    o && (o = null), s && (clearTimeout(s), s = 0)
                                }
                                r = b(r, {
                                    timeout: 0,
                                    overload: !1
                                }, {
                                    timeout: function(e, t) {
                                        return ("number" != typeof(e *= 1) || e < 0 || !Number.isFinite(e)) && t("timeout must be a positive number"), e
                                    }
                                }), n = !r.overload && "function" == typeof e.prototype.cancel && "function" == typeof l;
                                var f = function(e) {
                                        d(), u(e)
                                    },
                                    p = function(e) {
                                        d(), c(e)
                                    };
                                n ? t(f, p, l) : (o = [function(e) {
                                    p(e || Error("canceled"))
                                }], t(f, p, (function(e) {
                                    if (i) throw Error("Unable to subscribe on cancel event asynchronously");
                                    if ("function" != typeof e) throw TypeError("onCancel callback must be a function");
                                    o.push(e)
                                })), i = !0), r.timeout > 0 && (s = setTimeout((function() {
                                    var e = Error("timeout");
                                    e.code = "ETIMEDOUT", s = 0, a.cancel(e), c(e)
                                }), r.timeout))
                            }));
                        return n || (a.cancel = function(e) {
                            if (o) {
                                for (var t = o.length, r = 1; r < t; r++) o[r](e);
                                o[0](e), o = null
                            }
                        }), a
                    }

                    function O(e) {
                        var t = this._observers;
                        if (!t) return -1;
                        for (var r = t.length, n = 0; n < r; n++)
                            if (t[n]._target === e) return n;
                        return -1
                    }

                    function j(e, t, r, n, o) {
                        if (!r) return null;
                        if (0 === n) {
                            var i = typeof t;
                            if ("string" === i) {
                                var s, a, u = 0,
                                    c = 0,
                                    l = this.delimiter,
                                    f = l.length;
                                if (-1 !== (a = t.indexOf(l))) {
                                    s = new Array(5);
                                    do {
                                        s[u++] = t.slice(c, a), c = a + f
                                    } while (-1 !== (a = t.indexOf(l, c)));
                                    s[u++] = t.slice(c), t = s, o = u
                                } else t = [t], o = 1
                            } else "object" === i ? o = t.length : (t = [t], o = 1)
                        }
                        var p, m, h, g, y, b, v, _ = null,
                            M = t[n],
                            w = t[n + 1];
                        if (n === o) r._listeners && ("function" == typeof r._listeners ? (e && e.push(r._listeners), _ = [r]) : (e && e.push.apply(e, r._listeners), _ = [r]));
                        else {
                            if ("*" === M) {
                                for (a = (b = d(r)).length; a-- > 0;) "_listeners" !== (p = b[a]) && (v = j(e, t, r[p], n + 1, o)) && (_ ? _.push.apply(_, v) : _ = v);
                                return _
                            }
                            if ("**" === M) {
                                for ((y = n + 1 === o || n + 2 === o && "*" === w) && r._listeners && (_ = j(e, t, r, o, o)), a = (b = d(r)).length; a-- > 0;) "_listeners" !== (p = b[a]) && ("*" === p || "**" === p ? (r[p]._listeners && !y && (v = j(e, t, r[p], o, o)) && (_ ? _.push.apply(_, v) : _ = v), v = j(e, t, r[p], n, o)) : v = j(e, t, r[p], p === w ? n + 2 : n, o), v && (_ ? _.push.apply(_, v) : _ = v));
                                return _
                            }
                            r[M] && (_ = j(e, t, r[M], n + 1, o))
                        }
                        if ((m = r["*"]) && j(e, t, m, n + 1, o), h = r["**"])
                            if (n < o)
                                for (h._listeners && j(e, t, h, o, o), a = (b = d(h)).length; a-- > 0;) "_listeners" !== (p = b[a]) && (p === w ? j(e, t, h[p], n + 2, o) : p === M ? j(e, t, h[p], n + 1, o) : ((g = {})[p] = h[p], j(e, t, {
                                    "**": g
                                }, n + 1, o)));
                            else h._listeners ? j(e, t, h, o, o) : h["*"] && h["*"]._listeners && j(e, t, h["*"], o, o);
                        return _
                    }

                    function x(e, t, r) {
                        var n, o, i = 0,
                            s = 0,
                            a = this.delimiter,
                            u = a.length;
                        if ("string" == typeof e)
                            if (-1 !== (n = e.indexOf(a))) {
                                o = new Array(5);
                                do {
                                    o[i++] = e.slice(s, n), s = n + u
                                } while (-1 !== (n = e.indexOf(a, s)));
                                o[i++] = e.slice(s)
                            } else o = [e], i = 1;
                        else o = e, i = e.length;
                        if (i > 1)
                            for (n = 0; n + 1 < i; n++)
                                if ("**" === o[n] && "**" === o[n + 1]) return;
                        var c, l = this.listenerTree;
                        for (n = 0; n < i; n++)
                            if (l = l[c = o[n]] || (l[c] = {}), n === i - 1) return l._listeners ? ("function" == typeof l._listeners && (l._listeners = [l._listeners]), r ? l._listeners.unshift(t) : l._listeners.push(t), !l._listeners.warned && this._maxListeners > 0 && l._listeners.length > this._maxListeners && (l._listeners.warned = !0, m.call(this, l._listeners.length, c))) : l._listeners = t, !0;
                        return !0
                    }

                    function C(e, t, r, n) {
                        for (var o, i, s, a, u = d(e), c = u.length, l = e._listeners; c-- > 0;) o = e[i = u[c]], s = "_listeners" === i ? r : r ? r.concat(i) : [i], a = n || "symbol" == typeof i, l && t.push(a ? s : s.join(this.delimiter)), "object" == typeof o && C.call(this, o, t, s, a);
                        return t
                    }

                    function S(e) {
                        for (var t, r, n, o = d(e), i = o.length; i-- > 0;)(t = e[r = o[i]]) && (n = !0, "_listeners" === r || S(t) || delete e[r]);
                        return n
                    }

                    function I(e, t, r) {
                        this.emitter = e, this.event = t, this.listener = r
                    }

                    function E(e, t, r) {
                        if (!0 === r) i = !0;
                        else if (!1 === r) n = !0;
                        else {
                            if (!r || "object" != typeof r) throw TypeError("options should be an object or true");
                            var n = r.async,
                                i = r.promisify,
                                s = r.nextTick,
                                u = r.objectify
                        }
                        if (n || s || i) {
                            var c = t,
                                d = t._origin || t;
                            if (s && !a) throw Error("process.nextTick is not supported");
                            i === o && (i = "AsyncFunction" === t.constructor.name), t = function() {
                                var e = arguments,
                                    t = this,
                                    r = this.event;
                                return i ? s ? Promise.resolve() : new Promise((function(e) {
                                    l(e)
                                })).then((function() {
                                    return t.event = r, c.apply(t, e)
                                })) : (s ? process.nextTick : l)((function() {
                                    t.event = r, c.apply(t, e)
                                }))
                            }, t._async = !0, t._origin = d
                        }
                        return [t, u ? new I(this, e, t) : this]
                    }

                    function k(e) {
                        this._events = {}, this._newListener = !1, this._removeListener = !1, this.verboseMemoryLeak = !1, p.call(this, e)
                    }
                    I.prototype.off = function() {
                        return this.emitter.off(this.event, this.listener), this
                    }, k.EventEmitter2 = k, k.prototype.listenTo = function(e, t, r) {
                        if ("object" != typeof e) throw TypeError("target musts be an object");
                        var n = this;

                        function i(t) {
                            if ("object" != typeof t) throw TypeError("events must be an object");
                            var o, i = r.reducers,
                                s = O.call(n, e);
                            o = -1 === s ? new y(n, e, r) : n._observers[s];
                            for (var a, u = d(t), c = u.length, l = "function" == typeof i, f = 0; f < c; f++) a = u[f], o.subscribe(a, t[a] || a, l ? i : i && i[a])
                        }
                        return r = b(r, {
                            on: o,
                            off: o,
                            reducers: o
                        }, {
                            on: M,
                            off: M,
                            reducers: w
                        }), s(t) ? i(g(t)) : i("string" == typeof t ? g(t.split(/\s+/)) : t), this
                    }, k.prototype.stopListeningTo = function(e, t) {
                        var r = this._observers;
                        if (!r) return !1;
                        var n, o = r.length,
                            i = !1;
                        if (e && "object" != typeof e) throw TypeError("target should be an object");
                        for (; o-- > 0;) n = r[o], e && n._target !== e || (n.unsubscribe(t), i = !0);
                        return i
                    }, k.prototype.delimiter = ".", k.prototype.setMaxListeners = function(e) {
                        e !== o && (this._maxListeners = e, this._conf || (this._conf = {}), this._conf.maxListeners = e)
                    }, k.prototype.getMaxListeners = function() {
                        return this._maxListeners
                    }, k.prototype.event = "", k.prototype.once = function(e, t, r) {
                        return this._once(e, t, !1, r)
                    }, k.prototype.prependOnceListener = function(e, t, r) {
                        return this._once(e, t, !0, r)
                    }, k.prototype._once = function(e, t, r, n) {
                        return this._many(e, 1, t, r, n)
                    }, k.prototype.many = function(e, t, r, n) {
                        return this._many(e, t, r, !1, n)
                    }, k.prototype.prependMany = function(e, t, r, n) {
                        return this._many(e, t, r, !0, n)
                    }, k.prototype._many = function(e, t, r, n, o) {
                        var i = this;
                        if ("function" != typeof r) throw new Error("many only accepts instances of Function");

                        function s() {
                            return 0 == --t && i.off(e, s), r.apply(this, arguments)
                        }
                        return s._origin = r, this._on(e, s, n, o)
                    }, k.prototype.emit = function() {
                        if (!this._events && !this._all) return !1;
                        this._events || f.call(this);
                        var e, t, r, n, o, i, s = arguments[0],
                            a = this.wildcard;
                        if ("newListener" === s && !this._newListener && !this._events.newListener) return !1;
                        if (a && (e = s, "newListener" !== s && "removeListener" !== s && "object" == typeof s)) {
                            if (r = s.length, u)
                                for (n = 0; n < r; n++)
                                    if ("symbol" == typeof s[n]) {
                                        i = !0;
                                        break
                                    }
                            i || (s = s.join(this.delimiter))
                        }
                        var c, l = arguments.length;
                        if (this._all && this._all.length)
                            for (n = 0, r = (c = this._all.slice()).length; n < r; n++) switch (this.event = s, l) {
                                case 1:
                                    c[n].call(this, s);
                                    break;
                                case 2:
                                    c[n].call(this, s, arguments[1]);
                                    break;
                                case 3:
                                    c[n].call(this, s, arguments[1], arguments[2]);
                                    break;
                                default:
                                    c[n].apply(this, arguments)
                            }
                        if (a) c = [], j.call(this, c, e, this.listenerTree, 0, r);
                        else {
                            if ("function" == typeof(c = this._events[s])) {
                                switch (this.event = s, l) {
                                    case 1:
                                        c.call(this);
                                        break;
                                    case 2:
                                        c.call(this, arguments[1]);
                                        break;
                                    case 3:
                                        c.call(this, arguments[1], arguments[2]);
                                        break;
                                    default:
                                        for (t = new Array(l - 1), o = 1; o < l; o++) t[o - 1] = arguments[o];
                                        c.apply(this, t)
                                }
                                return !0
                            }
                            c && (c = c.slice())
                        }
                        if (c && c.length) {
                            if (l > 3)
                                for (t = new Array(l - 1), o = 1; o < l; o++) t[o - 1] = arguments[o];
                            for (n = 0, r = c.length; n < r; n++) switch (this.event = s, l) {
                                case 1:
                                    c[n].call(this);
                                    break;
                                case 2:
                                    c[n].call(this, arguments[1]);
                                    break;
                                case 3:
                                    c[n].call(this, arguments[1], arguments[2]);
                                    break;
                                default:
                                    c[n].apply(this, t)
                            }
                            return !0
                        }
                        if (!this.ignoreErrors && !this._all && "error" === s) throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event.");
                        return !!this._all
                    }, k.prototype.emitAsync = function() {
                        if (!this._events && !this._all) return !1;
                        this._events || f.call(this);
                        var e, t, r, n, o, i, s = arguments[0],
                            a = this.wildcard;
                        if ("newListener" === s && !this._newListener && !this._events.newListener) return Promise.resolve([!1]);
                        if (a && (e = s, "newListener" !== s && "removeListener" !== s && "object" == typeof s)) {
                            if (n = s.length, u)
                                for (o = 0; o < n; o++)
                                    if ("symbol" == typeof s[o]) {
                                        t = !0;
                                        break
                                    }
                            t || (s = s.join(this.delimiter))
                        }
                        var c, l = [],
                            d = arguments.length;
                        if (this._all)
                            for (o = 0, n = this._all.length; o < n; o++) switch (this.event = s, d) {
                                case 1:
                                    l.push(this._all[o].call(this, s));
                                    break;
                                case 2:
                                    l.push(this._all[o].call(this, s, arguments[1]));
                                    break;
                                case 3:
                                    l.push(this._all[o].call(this, s, arguments[1], arguments[2]));
                                    break;
                                default:
                                    l.push(this._all[o].apply(this, arguments))
                            }
                        if (a ? (c = [], j.call(this, c, e, this.listenerTree, 0)) : c = this._events[s], "function" == typeof c) switch (this.event = s, d) {
                            case 1:
                                l.push(c.call(this));
                                break;
                            case 2:
                                l.push(c.call(this, arguments[1]));
                                break;
                            case 3:
                                l.push(c.call(this, arguments[1], arguments[2]));
                                break;
                            default:
                                for (r = new Array(d - 1), i = 1; i < d; i++) r[i - 1] = arguments[i];
                                l.push(c.apply(this, r))
                        } else if (c && c.length) {
                            if (c = c.slice(), d > 3)
                                for (r = new Array(d - 1), i = 1; i < d; i++) r[i - 1] = arguments[i];
                            for (o = 0, n = c.length; o < n; o++) switch (this.event = s, d) {
                                case 1:
                                    l.push(c[o].call(this));
                                    break;
                                case 2:
                                    l.push(c[o].call(this, arguments[1]));
                                    break;
                                case 3:
                                    l.push(c[o].call(this, arguments[1], arguments[2]));
                                    break;
                                default:
                                    l.push(c[o].apply(this, r))
                            }
                        } else if (!this.ignoreErrors && !this._all && "error" === s) return arguments[1] instanceof Error ? Promise.reject(arguments[1]) : Promise.reject("Uncaught, unspecified 'error' event.");
                        return Promise.all(l)
                    }, k.prototype.on = function(e, t, r) {
                        return this._on(e, t, !1, r)
                    }, k.prototype.prependListener = function(e, t, r) {
                        return this._on(e, t, !0, r)
                    }, k.prototype.onAny = function(e) {
                        return this._onAny(e, !1)
                    }, k.prototype.prependAny = function(e) {
                        return this._onAny(e, !0)
                    }, k.prototype.addListener = k.prototype.on, k.prototype._onAny = function(e, t) {
                        if ("function" != typeof e) throw new Error("onAny only accepts instances of Function");
                        return this._all || (this._all = []), t ? this._all.unshift(e) : this._all.push(e), this
                    }, k.prototype._on = function(e, t, r, n) {
                        if ("function" == typeof e) return this._onAny(e, t), this;
                        if ("function" != typeof t) throw new Error("on only accepts instances of Function");
                        this._events || f.call(this);
                        var i, s = this;
                        return n !== o && (t = (i = E.call(this, e, t, n))[0], s = i[1]), this._newListener && this.emit("newListener", e, t), this.wildcard ? (x.call(this, e, t, r), s) : (this._events[e] ? ("function" == typeof this._events[e] && (this._events[e] = [this._events[e]]), r ? this._events[e].unshift(t) : this._events[e].push(t), !this._events[e].warned && this._maxListeners > 0 && this._events[e].length > this._maxListeners && (this._events[e].warned = !0, m.call(this, this._events[e].length, e))) : this._events[e] = t, s)
                    }, k.prototype.off = function(e, t) {
                        if ("function" != typeof t) throw new Error("removeListener only takes instances of Function");
                        var r, n = [];
                        if (this.wildcard) {
                            var o = "string" == typeof e ? e.split(this.delimiter) : e.slice();
                            if (!(n = j.call(this, null, o, this.listenerTree, 0))) return this
                        } else {
                            if (!this._events[e]) return this;
                            r = this._events[e], n.push({
                                _listeners: r
                            })
                        }
                        for (var i = 0; i < n.length; i++) {
                            var a = n[i];
                            if (r = a._listeners, s(r)) {
                                for (var u = -1, c = 0, l = r.length; c < l; c++)
                                    if (r[c] === t || r[c].listener && r[c].listener === t || r[c]._origin && r[c]._origin === t) {
                                        u = c;
                                        break
                                    }
                                if (u < 0) continue;
                                return this.wildcard ? a._listeners.splice(u, 1) : this._events[e].splice(u, 1), 0 === r.length && (this.wildcard ? delete a._listeners : delete this._events[e]), this._removeListener && this.emit("removeListener", e, t), this
                            }(r === t || r.listener && r.listener === t || r._origin && r._origin === t) && (this.wildcard ? delete a._listeners : delete this._events[e], this._removeListener && this.emit("removeListener", e, t))
                        }
                        return this.listenerTree && S(this.listenerTree), this
                    }, k.prototype.offAny = function(e) {
                        var t, r = 0,
                            n = 0;
                        if (e && this._all && this._all.length > 0) {
                            for (r = 0, n = (t = this._all).length; r < n; r++)
                                if (e === t[r]) return t.splice(r, 1), this._removeListener && this.emit("removeListenerAny", e), this
                        } else {
                            if (t = this._all, this._removeListener)
                                for (r = 0, n = t.length; r < n; r++) this.emit("removeListenerAny", t[r]);
                            this._all = []
                        }
                        return this
                    }, k.prototype.removeListener = k.prototype.off, k.prototype.removeAllListeners = function(e) {
                        if (e === o) return !this._events || f.call(this), this;
                        if (this.wildcard) {
                            var t, r = j.call(this, null, e, this.listenerTree, 0);
                            if (!r) return this;
                            for (t = 0; t < r.length; t++) r[t]._listeners = null;
                            this.listenerTree && S(this.listenerTree)
                        } else this._events && (this._events[e] = null);
                        return this
                    }, k.prototype.listeners = function(e) {
                        var t, r, n, i, s, a = this._events;
                        if (e === o) {
                            if (this.wildcard) throw Error("event name required for wildcard emitter");
                            if (!a) return [];
                            for (i = (t = d(a)).length, n = []; i-- > 0;) "function" == typeof(r = a[t[i]]) ? n.push(r) : n.push.apply(n, r);
                            return n
                        }
                        if (this.wildcard) {
                            if (!(s = this.listenerTree)) return [];
                            var u = [],
                                c = "string" == typeof e ? e.split(this.delimiter) : e.slice();
                            return j.call(this, u, c, s, 0), u
                        }
                        return a && (r = a[e]) ? "function" == typeof r ? [r] : r : []
                    }, k.prototype.eventNames = function(e) {
                        var t = this._events;
                        return this.wildcard ? C.call(this, this.listenerTree, [], null, e) : t ? d(t) : []
                    }, k.prototype.listenerCount = function(e) {
                        return this.listeners(e).length
                    }, k.prototype.hasListeners = function(e) {
                        if (this.wildcard) {
                            var t = [],
                                r = "string" == typeof e ? e.split(this.delimiter) : e.slice();
                            return j.call(this, t, r, this.listenerTree, 0), t.length > 0
                        }
                        var n = this._events,
                            i = this._all;
                        return !!(i && i.length || n && (e === o ? d(n).length : n[e]))
                    }, k.prototype.listenersAny = function() {
                        return this._all ? this._all : []
                    }, k.prototype.waitFor = function(e, t) {
                        var r = this,
                            n = typeof t;
                        return "number" === n ? t = {
                            timeout: t
                        } : "function" === n && (t = {
                            filter: t
                        }), P((t = b(t, {
                            timeout: 0,
                            filter: o,
                            handleError: !1,
                            Promise,
                            overload: !1
                        }, {
                            filter: M,
                            Promise: v
                        })).Promise, (function(n, o, i) {
                            function s() {
                                var i = t.filter;
                                if (!i || i.apply(r, arguments))
                                    if (r.off(e, s), t.handleError) {
                                        var a = arguments[0];
                                        a ? o(a) : n(h.apply(null, arguments).slice(1))
                                    } else n(h.apply(null, arguments))
                            }
                            i((function() {
                                r.off(e, s)
                            })), r._on(e, s, !1)
                        }), {
                            timeout: t.timeout,
                            overload: t.overload
                        })
                    };
                    var T = k.prototype;
                    Object.defineProperties(k, {
                        defaultMaxListeners: {
                            get: function() {
                                return T._maxListeners
                            },
                            set: function(e) {
                                if ("number" != typeof e || e < 0 || Number.isNaN(e)) throw TypeError("n must be a non-negative number");
                                T._maxListeners = e
                            },
                            enumerable: !0
                        },
                        once: {
                            value: function(e, t, r) {
                                return P((r = b(r, {
                                    Promise,
                                    timeout: 0,
                                    overload: !1
                                }, {
                                    Promise: v
                                })).Promise, (function(r, n, o) {
                                    var i;
                                    if ("function" == typeof e.addEventListener) return i = function() {
                                        r(h.apply(null, arguments))
                                    }, o((function() {
                                        e.removeEventListener(t, i)
                                    })), void e.addEventListener(t, i, {
                                        once: !0
                                    });
                                    var s, a = function() {
                                        s && e.removeListener("error", s), r(h.apply(null, arguments))
                                    };
                                    "error" !== t && (s = function(r) {
                                        e.removeListener(t, a), n(r)
                                    }, e.once("error", s)), o((function() {
                                        s && e.removeListener("error", s), e.removeListener(t, a)
                                    })), e.once(t, a)
                                }), {
                                    timeout: r.timeout,
                                    overload: r.overload
                                })
                            },
                            writable: !0,
                            configurable: !0
                        }
                    }), Object.defineProperties(T, {
                        _maxListeners: {
                            value: 10,
                            writable: !0,
                            configurable: !0
                        },
                        _observers: {
                            value: null,
                            writable: !0,
                            configurable: !0
                        }
                    }), (n = function() {
                        return k
                    }.call(t, r, t, e)) === o || (e.exports = n)
                }()
            },
            1: (module, __unused_webpack_exports, __webpack_require__) => {
                "use strict";
                var Buffer = __webpack_require__(8764).Buffer;
                const Token = __webpack_require__(3416),
                    strtok3 = __webpack_require__(5849),
                    {
                        stringToBytes,
                        tarHeaderChecksumMatches,
                        uint32SyncSafeToken
                    } = __webpack_require__(6188),
                    supported = __webpack_require__(9898),
                    minimumBytes = 4100;
                async function fromStream(e) {
                    const t = await strtok3.fromStream(e);
                    try {
                        return await fromTokenizer(t)
                    } finally {
                        await t.close()
                    }
                }
                async function fromBuffer(e) {
                    if (!(e instanceof Uint8Array || e instanceof ArrayBuffer || Buffer.isBuffer(e))) throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof e}\``);
                    const t = e instanceof Buffer ? e : Buffer.from(e);
                    if (t && t.length > 1) return fromTokenizer(strtok3.fromBuffer(t))
                }

                function _check(e, t, r) {
                    r = {
                        offset: 0,
                        ...r
                    };
                    for (const [n, o] of t.entries())
                        if (r.mask) {
                            if (o !== (r.mask[n] & e[n + r.offset])) return !1
                        } else if (o !== e[n + r.offset]) return !1;
                    return !0
                }
                async function fromTokenizer(e) {
                    try {
                        return _fromTokenizer(e)
                    } catch (e) {
                        if (!(e instanceof strtok3.EndOfStreamError)) throw e
                    }
                }
                async function _fromTokenizer(e) {
                    let t = Buffer.alloc(minimumBytes);
                    const r = (e, r) => _check(t, e, r),
                        n = (e, t) => r(stringToBytes(e), t);
                    if (e.fileInfo.size || (e.fileInfo.size = Number.MAX_SAFE_INTEGER), await e.peekBuffer(t, {
                            length: 12,
                            mayBeLess: !0
                        }), r([66, 77])) return {
                        ext: "bmp",
                        mime: "image/bmp"
                    };
                    if (r([11, 119])) return {
                        ext: "ac3",
                        mime: "audio/vnd.dolby.dd-raw"
                    };
                    if (r([120, 1])) return {
                        ext: "dmg",
                        mime: "application/x-apple-diskimage"
                    };
                    if (r([77, 90])) return {
                        ext: "exe",
                        mime: "application/x-msdownload"
                    };
                    if (r([37, 33])) return await e.peekBuffer(t, {
                        length: 24,
                        mayBeLess: !0
                    }), n("PS-Adobe-", {
                        offset: 2
                    }) && n(" EPSF-", {
                        offset: 14
                    }) ? {
                        ext: "eps",
                        mime: "application/eps"
                    } : {
                        ext: "ps",
                        mime: "application/postscript"
                    };
                    if (r([31, 160]) || r([31, 157])) return {
                        ext: "Z",
                        mime: "application/x-compress"
                    };
                    if (r([255, 216, 255])) return {
                        ext: "jpg",
                        mime: "image/jpeg"
                    };
                    if (r([73, 73, 188])) return {
                        ext: "jxr",
                        mime: "image/vnd.ms-photo"
                    };
                    if (r([31, 139, 8])) return {
                        ext: "gz",
                        mime: "application/gzip"
                    };
                    if (r([66, 90, 104])) return {
                        ext: "bz2",
                        mime: "application/x-bzip2"
                    };
                    if (n("ID3")) {
                        await e.ignore(6);
                        const t = await e.readToken(uint32SyncSafeToken);
                        return e.position + t > e.fileInfo.size ? {
                            ext: "mp3",
                            mime: "audio/mpeg"
                        } : (await e.ignore(t), fromTokenizer(e))
                    }
                    if (n("MP+")) return {
                        ext: "mpc",
                        mime: "audio/x-musepack"
                    };
                    if ((67 === t[0] || 70 === t[0]) && r([87, 83], {
                            offset: 1
                        })) return {
                        ext: "swf",
                        mime: "application/x-shockwave-flash"
                    };
                    if (r([71, 73, 70])) return {
                        ext: "gif",
                        mime: "image/gif"
                    };
                    if (n("FLIF")) return {
                        ext: "flif",
                        mime: "image/flif"
                    };
                    if (n("8BPS")) return {
                        ext: "psd",
                        mime: "image/vnd.adobe.photoshop"
                    };
                    if (n("WEBP", {
                            offset: 8
                        })) return {
                        ext: "webp",
                        mime: "image/webp"
                    };
                    if (n("MPCK")) return {
                        ext: "mpc",
                        mime: "audio/x-musepack"
                    };
                    if (n("FORM")) return {
                        ext: "aif",
                        mime: "audio/aiff"
                    };
                    if (n("icns", {
                            offset: 0
                        })) return {
                        ext: "icns",
                        mime: "image/icns"
                    };
                    if (r([80, 75, 3, 4])) {
                        try {
                            for (; e.position + 30 < e.fileInfo.size;) {
                                await e.readBuffer(t, {
                                    length: 30
                                });
                                const r = {
                                    compressedSize: t.readUInt32LE(18),
                                    uncompressedSize: t.readUInt32LE(22),
                                    filenameLength: t.readUInt16LE(26),
                                    extraFieldLength: t.readUInt16LE(28)
                                };
                                if (r.filename = await e.readToken(new Token.StringType(r.filenameLength, "utf-8")), await e.ignore(r.extraFieldLength), "META-INF/mozilla.rsa" === r.filename) return {
                                    ext: "xpi",
                                    mime: "application/x-xpinstall"
                                };
                                if (r.filename.endsWith(".rels") || r.filename.endsWith(".xml")) switch (r.filename.split("/")[0]) {
                                    case "_rels":
                                    default:
                                        break;
                                    case "word":
                                        return {
                                            ext: "docx",
                                            mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        };
                                    case "ppt":
                                        return {
                                            ext: "pptx",
                                            mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                        };
                                    case "xl":
                                        return {
                                            ext: "xlsx",
                                            mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        }
                                }
                                if (r.filename.startsWith("xl/")) return {
                                    ext: "xlsx",
                                    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                };
                                if (r.filename.startsWith("3D/") && r.filename.endsWith(".model")) return {
                                    ext: "3mf",
                                    mime: "model/3mf"
                                };
                                if ("mimetype" === r.filename && r.compressedSize === r.uncompressedSize) switch (await e.readToken(new Token.StringType(r.compressedSize, "utf-8"))) {
                                    case "application/epub+zip":
                                        return {
                                            ext: "epub",
                                            mime: "application/epub+zip"
                                        };
                                    case "application/vnd.oasis.opendocument.text":
                                        return {
                                            ext: "odt",
                                            mime: "application/vnd.oasis.opendocument.text"
                                        };
                                    case "application/vnd.oasis.opendocument.spreadsheet":
                                        return {
                                            ext: "ods",
                                            mime: "application/vnd.oasis.opendocument.spreadsheet"
                                        };
                                    case "application/vnd.oasis.opendocument.presentation":
                                        return {
                                            ext: "odp",
                                            mime: "application/vnd.oasis.opendocument.presentation"
                                        }
                                }
                                if (0 === r.compressedSize) {
                                    let r = -1;
                                    for (; r < 0 && e.position < e.fileInfo.size;) await e.peekBuffer(t, {
                                        mayBeLess: !0
                                    }), r = t.indexOf("504B0304", 0, "hex"), await e.ignore(r >= 0 ? r : t.length)
                                } else await e.ignore(r.compressedSize)
                            }
                        } catch (e) {
                            if (!(e instanceof strtok3.EndOfStreamError)) throw e
                        }
                        return {
                            ext: "zip",
                            mime: "application/zip"
                        }
                    }
                    if (n("OggS")) {
                        await e.ignore(28);
                        const t = Buffer.alloc(8);
                        return await e.readBuffer(t), _check(t, [79, 112, 117, 115, 72, 101, 97, 100]) ? {
                            ext: "opus",
                            mime: "audio/opus"
                        } : _check(t, [128, 116, 104, 101, 111, 114, 97]) ? {
                            ext: "ogv",
                            mime: "video/ogg"
                        } : _check(t, [1, 118, 105, 100, 101, 111, 0]) ? {
                            ext: "ogm",
                            mime: "video/ogg"
                        } : _check(t, [127, 70, 76, 65, 67]) ? {
                            ext: "oga",
                            mime: "audio/ogg"
                        } : _check(t, [83, 112, 101, 101, 120, 32, 32]) ? {
                            ext: "spx",
                            mime: "audio/ogg"
                        } : _check(t, [1, 118, 111, 114, 98, 105, 115]) ? {
                            ext: "ogg",
                            mime: "audio/ogg"
                        } : {
                            ext: "ogx",
                            mime: "application/ogg"
                        }
                    }
                    if (r([80, 75]) && (3 === t[2] || 5 === t[2] || 7 === t[2]) && (4 === t[3] || 6 === t[3] || 8 === t[3])) return {
                        ext: "zip",
                        mime: "application/zip"
                    };
                    if (n("ftyp", {
                            offset: 4
                        }) && 0 != (96 & t[8])) {
                        const e = t.toString("binary", 8, 12).replace("\0", " ").trim();
                        switch (e) {
                            case "avif":
                                return {
                                    ext: "avif",
                                    mime: "image/avif"
                                };
                            case "mif1":
                                return {
                                    ext: "heic",
                                    mime: "image/heif"
                                };
                            case "msf1":
                                return {
                                    ext: "heic",
                                    mime: "image/heif-sequence"
                                };
                            case "heic":
                            case "heix":
                                return {
                                    ext: "heic",
                                    mime: "image/heic"
                                };
                            case "hevc":
                            case "hevx":
                                return {
                                    ext: "heic",
                                    mime: "image/heic-sequence"
                                };
                            case "qt":
                                return {
                                    ext: "mov",
                                    mime: "video/quicktime"
                                };
                            case "M4V":
                            case "M4VH":
                            case "M4VP":
                                return {
                                    ext: "m4v",
                                    mime: "video/x-m4v"
                                };
                            case "M4P":
                                return {
                                    ext: "m4p",
                                    mime: "video/mp4"
                                };
                            case "M4B":
                                return {
                                    ext: "m4b",
                                    mime: "audio/mp4"
                                };
                            case "M4A":
                                return {
                                    ext: "m4a",
                                    mime: "audio/x-m4a"
                                };
                            case "F4V":
                                return {
                                    ext: "f4v",
                                    mime: "video/mp4"
                                };
                            case "F4P":
                                return {
                                    ext: "f4p",
                                    mime: "video/mp4"
                                };
                            case "F4A":
                                return {
                                    ext: "f4a",
                                    mime: "audio/mp4"
                                };
                            case "F4B":
                                return {
                                    ext: "f4b",
                                    mime: "audio/mp4"
                                };
                            case "crx":
                                return {
                                    ext: "cr3",
                                    mime: "image/x-canon-cr3"
                                };
                            default:
                                return e.startsWith("3g") ? e.startsWith("3g2") ? {
                                    ext: "3g2",
                                    mime: "video/3gpp2"
                                } : {
                                    ext: "3gp",
                                    mime: "video/3gpp"
                                } : {
                                    ext: "mp4",
                                    mime: "video/mp4"
                                }
                        }
                    }
                    if (n("MThd")) return {
                        ext: "mid",
                        mime: "audio/midi"
                    };
                    if (n("wOFF") && (r([0, 1, 0, 0], {
                            offset: 4
                        }) || n("OTTO", {
                            offset: 4
                        }))) return {
                        ext: "woff",
                        mime: "font/woff"
                    };
                    if (n("wOF2") && (r([0, 1, 0, 0], {
                            offset: 4
                        }) || n("OTTO", {
                            offset: 4
                        }))) return {
                        ext: "woff2",
                        mime: "font/woff2"
                    };
                    if (r([212, 195, 178, 161]) || r([161, 178, 195, 212])) return {
                        ext: "pcap",
                        mime: "application/vnd.tcpdump.pcap"
                    };
                    if (n("DSD ")) return {
                        ext: "dsf",
                        mime: "audio/x-dsf"
                    };
                    if (n("LZIP")) return {
                        ext: "lz",
                        mime: "application/x-lzip"
                    };
                    if (n("fLaC")) return {
                        ext: "flac",
                        mime: "audio/x-flac"
                    };
                    if (r([66, 80, 71, 251])) return {
                        ext: "bpg",
                        mime: "image/bpg"
                    };
                    if (n("wvpk")) return {
                        ext: "wv",
                        mime: "audio/wavpack"
                    };
                    if (n("%PDF")) {
                        await e.ignore(1350);
                        const t = 10485760,
                            r = Buffer.alloc(Math.min(t, e.fileInfo.size));
                        return await e.readBuffer(r, {
                            mayBeLess: !0
                        }), r.includes(Buffer.from("AIPrivateData")) ? {
                            ext: "ai",
                            mime: "application/postscript"
                        } : {
                            ext: "pdf",
                            mime: "application/pdf"
                        }
                    }
                    if (r([0, 97, 115, 109])) return {
                        ext: "wasm",
                        mime: "application/wasm"
                    };
                    if (r([73, 73, 42, 0])) return n("CR", {
                        offset: 8
                    }) ? {
                        ext: "cr2",
                        mime: "image/x-canon-cr2"
                    } : r([28, 0, 254, 0], {
                        offset: 8
                    }) || r([31, 0, 11, 0], {
                        offset: 8
                    }) ? {
                        ext: "nef",
                        mime: "image/x-nikon-nef"
                    } : r([8, 0, 0, 0], {
                        offset: 4
                    }) && (r([45, 0, 254, 0], {
                        offset: 8
                    }) || r([39, 0, 254, 0], {
                        offset: 8
                    })) ? {
                        ext: "dng",
                        mime: "image/x-adobe-dng"
                    } : (t = Buffer.alloc(24), await e.peekBuffer(t), (r([16, 251, 134, 1], {
                        offset: 4
                    }) || r([8, 0, 0, 0], {
                        offset: 4
                    })) && r([0, 254, 0, 4, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1], {
                        offset: 9
                    }) ? {
                        ext: "arw",
                        mime: "image/x-sony-arw"
                    } : {
                        ext: "tif",
                        mime: "image/tiff"
                    });
                    if (r([77, 77, 0, 42])) return {
                        ext: "tif",
                        mime: "image/tiff"
                    };
                    if (n("MAC ")) return {
                        ext: "ape",
                        mime: "audio/ape"
                    };
                    if (r([26, 69, 223, 163])) {
                        async function t() {
                            const t = await e.peekNumber(Token.UINT8);
                            let r = 128,
                                n = 0;
                            for (; 0 == (t & r);) ++n, r >>= 1;
                            const o = Buffer.alloc(n + 1);
                            return await e.readBuffer(o), o
                        }
                        async function r() {
                            const e = await t(),
                                r = await t();
                            r[0] ^= 128 >> r.length - 1;
                            const n = Math.min(6, r.length);
                            return {
                                id: e.readUIntBE(0, e.length),
                                len: r.readUIntBE(r.length - n, n)
                            }
                        }
                        async function n(t, n) {
                            for (; n > 0;) {
                                const t = await r();
                                if (17026 === t.id) return e.readToken(new Token.StringType(t.len, "utf-8"));
                                await e.ignore(t.len), --n
                            }
                        }
                        const o = await r();
                        switch (await n(0, o.len)) {
                            case "webm":
                                return {
                                    ext: "webm",
                                    mime: "video/webm"
                                };
                            case "matroska":
                                return {
                                    ext: "mkv",
                                    mime: "video/x-matroska"
                                };
                            default:
                                return
                        }
                    }
                    if (r([82, 73, 70, 70])) {
                        if (r([65, 86, 73], {
                                offset: 8
                            })) return {
                            ext: "avi",
                            mime: "video/vnd.avi"
                        };
                        if (r([87, 65, 86, 69], {
                                offset: 8
                            })) return {
                            ext: "wav",
                            mime: "audio/vnd.wave"
                        };
                        if (r([81, 76, 67, 77], {
                                offset: 8
                            })) return {
                            ext: "qcp",
                            mime: "audio/qcelp"
                        }
                    }
                    if (n("SQLi")) return {
                        ext: "sqlite",
                        mime: "application/x-sqlite3"
                    };
                    if (r([78, 69, 83, 26])) return {
                        ext: "nes",
                        mime: "application/x-nintendo-nes-rom"
                    };
                    if (n("Cr24")) return {
                        ext: "crx",
                        mime: "application/x-google-chrome-extension"
                    };
                    if (n("MSCF") || n("ISc(")) return {
                        ext: "cab",
                        mime: "application/vnd.ms-cab-compressed"
                    };
                    if (r([237, 171, 238, 219])) return {
                        ext: "rpm",
                        mime: "application/x-rpm"
                    };
                    if (r([197, 208, 211, 198])) return {
                        ext: "eps",
                        mime: "application/eps"
                    };
                    if (r([40, 181, 47, 253])) return {
                        ext: "zst",
                        mime: "application/zstd"
                    };
                    if (r([79, 84, 84, 79, 0])) return {
                        ext: "otf",
                        mime: "font/otf"
                    };
                    if (n("#!AMR")) return {
                        ext: "amr",
                        mime: "audio/amr"
                    };
                    if (n("{\\rtf")) return {
                        ext: "rtf",
                        mime: "application/rtf"
                    };
                    if (r([70, 76, 86, 1])) return {
                        ext: "flv",
                        mime: "video/x-flv"
                    };
                    if (n("IMPM")) return {
                        ext: "it",
                        mime: "audio/x-it"
                    };
                    if (n("-lh0-", {
                            offset: 2
                        }) || n("-lh1-", {
                            offset: 2
                        }) || n("-lh2-", {
                            offset: 2
                        }) || n("-lh3-", {
                            offset: 2
                        }) || n("-lh4-", {
                            offset: 2
                        }) || n("-lh5-", {
                            offset: 2
                        }) || n("-lh6-", {
                            offset: 2
                        }) || n("-lh7-", {
                            offset: 2
                        }) || n("-lzs-", {
                            offset: 2
                        }) || n("-lz4-", {
                            offset: 2
                        }) || n("-lz5-", {
                            offset: 2
                        }) || n("-lhd-", {
                            offset: 2
                        })) return {
                        ext: "lzh",
                        mime: "application/x-lzh-compressed"
                    };
                    if (r([0, 0, 1, 186])) {
                        if (r([33], {
                                offset: 4,
                                mask: [241]
                            })) return {
                            ext: "mpg",
                            mime: "video/MP1S"
                        };
                        if (r([68], {
                                offset: 4,
                                mask: [196]
                            })) return {
                            ext: "mpg",
                            mime: "video/MP2P"
                        }
                    }
                    if (n("ITSF")) return {
                        ext: "chm",
                        mime: "application/vnd.ms-htmlhelp"
                    };
                    if (r([253, 55, 122, 88, 90, 0])) return {
                        ext: "xz",
                        mime: "application/x-xz"
                    };
                    if (n("<?xml ")) return {
                        ext: "xml",
                        mime: "application/xml"
                    };
                    if (r([55, 122, 188, 175, 39, 28])) return {
                        ext: "7z",
                        mime: "application/x-7z-compressed"
                    };
                    if (r([82, 97, 114, 33, 26, 7]) && (0 === t[6] || 1 === t[6])) return {
                        ext: "rar",
                        mime: "application/x-rar-compressed"
                    };
                    if (n("solid ")) return {
                        ext: "stl",
                        mime: "model/stl"
                    };
                    if (n("BLENDER")) return {
                        ext: "blend",
                        mime: "application/x-blender"
                    };
                    if (n("!<arch>")) return await e.ignore(8), "debian-binary" === await e.readToken(new Token.StringType(13, "ascii")) ? {
                        ext: "deb",
                        mime: "application/x-deb"
                    } : {
                        ext: "ar",
                        mime: "application/x-unix-archive"
                    };
                    if (r([137, 80, 78, 71, 13, 10, 26, 10])) {
                        async function t() {
                            return {
                                length: await e.readToken(Token.INT32_BE),
                                type: await e.readToken(new Token.StringType(4, "binary"))
                            }
                        }
                        await e.ignore(8);
                        do {
                            const r = await t();
                            if (r.length < 0) return;
                            switch (r.type) {
                                case "IDAT":
                                    return {
                                        ext: "png",
                                        mime: "image/png"
                                    };
                                case "acTL":
                                    return {
                                        ext: "apng",
                                        mime: "image/apng"
                                    };
                                default:
                                    await e.ignore(r.length + 4)
                            }
                        } while (e.position + 8 < e.fileInfo.size);
                        return {
                            ext: "png",
                            mime: "image/png"
                        }
                    }
                    if (r([65, 82, 82, 79, 87, 49, 0, 0])) return {
                        ext: "arrow",
                        mime: "application/x-apache-arrow"
                    };
                    if (r([103, 108, 84, 70, 2, 0, 0, 0])) return {
                        ext: "glb",
                        mime: "model/gltf-binary"
                    };
                    if (r([102, 114, 101, 101], {
                            offset: 4
                        }) || r([109, 100, 97, 116], {
                            offset: 4
                        }) || r([109, 111, 111, 118], {
                            offset: 4
                        }) || r([119, 105, 100, 101], {
                            offset: 4
                        })) return {
                        ext: "mov",
                        mime: "video/quicktime"
                    };
                    if (r([73, 73, 82, 79, 8, 0, 0, 0, 24])) return {
                        ext: "orf",
                        mime: "image/x-olympus-orf"
                    };
                    if (n("gimp xcf ")) return {
                        ext: "xcf",
                        mime: "image/x-xcf"
                    };
                    if (r([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216])) return {
                        ext: "rw2",
                        mime: "image/x-panasonic-rw2"
                    };
                    if (r([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
                        async function t() {
                            const t = Buffer.alloc(16);
                            return await e.readBuffer(t), {
                                id: t,
                                size: Number(await e.readToken(Token.UINT64_LE))
                            }
                        }
                        for (await e.ignore(30); e.position + 24 < e.fileInfo.size;) {
                            const r = await t();
                            let n = r.size - 24;
                            if (_check(r.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])) {
                                const t = Buffer.alloc(16);
                                if (n -= await e.readBuffer(t), _check(t, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) return {
                                    ext: "asf",
                                    mime: "audio/x-ms-asf"
                                };
                                if (_check(t, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) return {
                                    ext: "asf",
                                    mime: "video/x-ms-asf"
                                };
                                break
                            }
                            await e.ignore(n)
                        }
                        return {
                            ext: "asf",
                            mime: "application/vnd.ms-asf"
                        }
                    }
                    if (r([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) return {
                        ext: "ktx",
                        mime: "image/ktx"
                    };
                    if ((r([126, 16, 4]) || r([126, 24, 4])) && r([48, 77, 73, 69], {
                            offset: 4
                        })) return {
                        ext: "mie",
                        mime: "application/x-mie"
                    };
                    if (r([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], {
                            offset: 2
                        })) return {
                        ext: "shp",
                        mime: "application/x-esri-shape"
                    };
                    if (r([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) switch (await e.ignore(20), await e.readToken(new Token.StringType(4, "ascii"))) {
                        case "jp2 ":
                            return {
                                ext: "jp2",
                                mime: "image/jp2"
                            };
                        case "jpx ":
                            return {
                                ext: "jpx",
                                mime: "image/jpx"
                            };
                        case "jpm ":
                            return {
                                ext: "jpm",
                                mime: "image/jpm"
                            };
                        case "mjp2":
                            return {
                                ext: "mj2",
                                mime: "image/mj2"
                            };
                        default:
                            return
                    }
                    if (r([255, 10]) || r([0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10])) return {
                        ext: "jxl",
                        mime: "image/jxl"
                    };
                    if (r([0, 0, 1, 186]) || r([0, 0, 1, 179])) return {
                        ext: "mpg",
                        mime: "video/mpeg"
                    };
                    if (r([0, 1, 0, 0, 0])) return {
                        ext: "ttf",
                        mime: "font/ttf"
                    };
                    if (r([0, 0, 1, 0])) return {
                        ext: "ico",
                        mime: "image/x-icon"
                    };
                    if (r([0, 0, 2, 0])) return {
                        ext: "cur",
                        mime: "image/x-icon"
                    };
                    if (r([208, 207, 17, 224, 161, 177, 26, 225])) return {
                        ext: "cfb",
                        mime: "application/x-cfb"
                    };
                    if (await e.peekBuffer(t, {
                            length: Math.min(256, e.fileInfo.size),
                            mayBeLess: !0
                        }), n("BEGIN:")) {
                        if (n("VCARD", {
                                offset: 6
                            })) return {
                            ext: "vcf",
                            mime: "text/vcard"
                        };
                        if (n("VCALENDAR", {
                                offset: 6
                            })) return {
                            ext: "ics",
                            mime: "text/calendar"
                        }
                    }
                    if (n("FUJIFILMCCD-RAW")) return {
                        ext: "raf",
                        mime: "image/x-fujifilm-raf"
                    };
                    if (n("Extended Module:")) return {
                        ext: "xm",
                        mime: "audio/x-xm"
                    };
                    if (n("Creative Voice File")) return {
                        ext: "voc",
                        mime: "audio/x-voc"
                    };
                    if (r([4, 0, 0, 0]) && t.length >= 16) {
                        const e = t.readUInt32LE(12);
                        if (e > 12 && t.length >= e + 16) try {
                            const r = t.slice(16, e + 16).toString();
                            if (JSON.parse(r).files) return {
                                ext: "asar",
                                mime: "application/x-asar"
                            }
                        } catch (e) {}
                    }
                    if (r([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) return {
                        ext: "mxf",
                        mime: "application/mxf"
                    };
                    if (n("SCRM", {
                            offset: 44
                        })) return {
                        ext: "s3m",
                        mime: "audio/x-s3m"
                    };
                    if (r([71], {
                            offset: 4
                        }) && (r([71], {
                            offset: 192
                        }) || r([71], {
                            offset: 196
                        }))) return {
                        ext: "mts",
                        mime: "video/mp2t"
                    };
                    if (r([66, 79, 79, 75, 77, 79, 66, 73], {
                            offset: 60
                        })) return {
                        ext: "mobi",
                        mime: "application/x-mobipocket-ebook"
                    };
                    if (r([68, 73, 67, 77], {
                            offset: 128
                        })) return {
                        ext: "dcm",
                        mime: "application/dicom"
                    };
                    if (r([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70])) return {
                        ext: "lnk",
                        mime: "application/x.ms.shortcut"
                    };
                    if (r([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0])) return {
                        ext: "alias",
                        mime: "application/x.apple.alias"
                    };
                    if (r([76, 80], {
                            offset: 34
                        }) && (r([0, 0, 1], {
                            offset: 8
                        }) || r([1, 0, 2], {
                            offset: 8
                        }) || r([2, 0, 2], {
                            offset: 8
                        }))) return {
                        ext: "eot",
                        mime: "application/vnd.ms-fontobject"
                    };
                    if (r([6, 6, 237, 245, 216, 29, 70, 229, 189, 49, 239, 231, 254, 116, 183, 29])) return {
                        ext: "indd",
                        mime: "application/x-indesign"
                    };
                    if (await e.peekBuffer(t, {
                            length: Math.min(512, e.fileInfo.size),
                            mayBeLess: !0
                        }), tarHeaderChecksumMatches(t)) return {
                        ext: "tar",
                        mime: "application/x-tar"
                    };
                    if (r([255, 254, 255, 14, 83, 0, 107, 0, 101, 0, 116, 0, 99, 0, 104, 0, 85, 0, 112, 0, 32, 0, 77, 0, 111, 0, 100, 0, 101, 0, 108, 0])) return {
                        ext: "skp",
                        mime: "application/vnd.sketchup.skp"
                    };
                    if (n("-----BEGIN PGP MESSAGE-----")) return {
                        ext: "pgp",
                        mime: "application/pgp-encrypted"
                    };
                    if (t.length >= 2 && r([255, 224], {
                            offset: 0,
                            mask: [255, 224]
                        })) {
                        if (r([16], {
                                offset: 1,
                                mask: [22]
                            })) return r([8], {
                            offset: 1,
                            mask: [8]
                        }), {
                            ext: "aac",
                            mime: "audio/aac"
                        };
                        if (r([2], {
                                offset: 1,
                                mask: [6]
                            })) return {
                            ext: "mp3",
                            mime: "audio/mpeg"
                        };
                        if (r([4], {
                                offset: 1,
                                mask: [6]
                            })) return {
                            ext: "mp2",
                            mime: "audio/mpeg"
                        };
                        if (r([6], {
                                offset: 1,
                                mask: [6]
                            })) return {
                            ext: "mp1",
                            mime: "audio/mpeg"
                        }
                    }
                }
                const stream = readableStream => new Promise(((resolve, reject) => {
                        const stream = eval("require")("stream");
                        readableStream.on("error", reject), readableStream.once("readable", (async() => {
                            const e = new stream.PassThrough;
                            let t;
                            t = stream.pipeline ? stream.pipeline(readableStream, e, (() => {})) : readableStream.pipe(e);
                            const r = readableStream.read(minimumBytes) || readableStream.read() || Buffer.alloc(0);
                            try {
                                const t = await fromBuffer(r);
                                e.fileType = t
                            } catch (e) {
                                reject(e)
                            }
                            resolve(t)
                        }))
                    })),
                    fileType = {
                        fromStream,
                        fromTokenizer,
                        fromBuffer,
                        stream
                    };
                Object.defineProperty(fileType, "extensions", {
                    get: () => new Set(supported.extensions)
                }), Object.defineProperty(fileType, "mimeTypes", {
                    get: () => new Set(supported.mimeTypes)
                }), module.exports = fileType
            },
            7769: (e, t, r) => {
                "use strict";
                const n = r(6597),
                    o = r(1),
                    i = {
                        fromFile: async function(e) {
                            const t = await n.fromFile(e);
                            try {
                                return await o.fromTokenizer(t)
                            } finally {
                                await t.close()
                            }
                        }
                    };
                Object.assign(i, o), Object.defineProperty(i, "extensions", {
                    get: () => o.extensions
                }), Object.defineProperty(i, "mimeTypes", {
                    get: () => o.mimeTypes
                }), e.exports = i
            },
            9898: e => {
                "use strict";
                e.exports = {
                    extensions: ["jpg", "png", "apng", "gif", "webp", "flif", "xcf", "cr2", "cr3", "orf", "arw", "dng", "nef", "rw2", "raf", "tif", "bmp", "icns", "jxr", "psd", "indd", "zip", "tar", "rar", "gz", "bz2", "7z", "dmg", "mp4", "mid", "mkv", "webm", "mov", "avi", "mpg", "mp2", "mp3", "m4a", "oga", "ogg", "ogv", "opus", "flac", "wav", "spx", "amr", "pdf", "epub", "exe", "swf", "rtf", "wasm", "woff", "woff2", "eot", "ttf", "otf", "ico", "flv", "ps", "xz", "sqlite", "nes", "crx", "xpi", "cab", "deb", "ar", "rpm", "Z", "lz", "cfb", "mxf", "mts", "blend", "bpg", "docx", "pptx", "xlsx", "3gp", "3g2", "jp2", "jpm", "jpx", "mj2", "aif", "qcp", "odt", "ods", "odp", "xml", "mobi", "heic", "cur", "ktx", "ape", "wv", "dcm", "ics", "glb", "pcap", "dsf", "lnk", "alias", "voc", "ac3", "m4v", "m4p", "m4b", "f4v", "f4p", "f4b", "f4a", "mie", "asf", "ogm", "ogx", "mpc", "arrow", "shp", "aac", "mp1", "it", "s3m", "xm", "ai", "skp", "avif", "eps", "lzh", "pgp", "asar", "stl", "chm", "3mf", "zst", "jxl", "vcf"],
                    mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/flif", "image/x-xcf", "image/x-canon-cr2", "image/x-canon-cr3", "image/tiff", "image/bmp", "image/vnd.ms-photo", "image/vnd.adobe.photoshop", "application/x-indesign", "application/epub+zip", "application/x-xpinstall", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.spreadsheet", "application/vnd.oasis.opendocument.presentation", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip", "application/x-tar", "application/x-rar-compressed", "application/gzip", "application/x-bzip2", "application/x-7z-compressed", "application/x-apple-diskimage", "application/x-apache-arrow", "video/mp4", "audio/midi", "video/x-matroska", "video/webm", "video/quicktime", "video/vnd.avi", "audio/vnd.wave", "audio/qcelp", "audio/x-ms-asf", "video/x-ms-asf", "application/vnd.ms-asf", "video/mpeg", "video/3gpp", "audio/mpeg", "audio/mp4", "audio/opus", "video/ogg", "audio/ogg", "application/ogg", "audio/x-flac", "audio/ape", "audio/wavpack", "audio/amr", "application/pdf", "application/x-msdownload", "application/x-shockwave-flash", "application/rtf", "application/wasm", "font/woff", "font/woff2", "application/vnd.ms-fontobject", "font/ttf", "font/otf", "image/x-icon", "video/x-flv", "application/postscript", "application/eps", "application/x-xz", "application/x-sqlite3", "application/x-nintendo-nes-rom", "application/x-google-chrome-extension", "application/vnd.ms-cab-compressed", "application/x-deb", "application/x-unix-archive", "application/x-rpm", "application/x-compress", "application/x-lzip", "application/x-cfb", "application/x-mie", "application/mxf", "video/mp2t", "application/x-blender", "image/bpg", "image/jp2", "image/jpx", "image/jpm", "image/mj2", "audio/aiff", "application/xml", "application/x-mobipocket-ebook", "image/heif", "image/heif-sequence", "image/heic", "image/heic-sequence", "image/icns", "image/ktx", "application/dicom", "audio/x-musepack", "text/calendar", "text/vcard", "model/gltf-binary", "application/vnd.tcpdump.pcap", "audio/x-dsf", "application/x.ms.shortcut", "application/x.apple.alias", "audio/x-voc", "audio/vnd.dolby.dd-raw", "audio/x-m4a", "image/apng", "image/x-olympus-orf", "image/x-sony-arw", "image/x-adobe-dng", "image/x-nikon-nef", "image/x-panasonic-rw2", "image/x-fujifilm-raf", "video/x-m4v", "video/3gpp2", "application/x-esri-shape", "audio/aac", "audio/x-it", "audio/x-s3m", "audio/x-xm", "video/MP1S", "video/MP2P", "application/vnd.sketchup.skp", "image/avif", "application/x-lzh-compressed", "application/pgp-encrypted", "application/x-asar", "model/stl", "application/vnd.ms-htmlhelp", "model/3mf", "image/jxl", "application/zstd"]
                }
            },
            6188: (e, t) => {
                "use strict";
                t.stringToBytes = e => [...e].map((e => e.charCodeAt(0))), t.tarHeaderChecksumMatches = (e, t = 0) => {
                    const r = parseInt(e.toString("utf8", 148, 154).replace(/\0.*$/, "").trim(), 8);
                    if (isNaN(r)) return !1;
                    let n = 256;
                    for (let r = t; r < t + 148; r++) n += e[r];
                    for (let r = t + 156; r < t + 512; r++) n += e[r];
                    return r === n
                }, t.uint32SyncSafeToken = {
                    get: (e, t) => 127 & e[t + 3] | e[t + 2] << 7 | e[t + 1] << 14 | e[t] << 21,
                    len: 4
                }
            },
            645: (e, t) => {
                t.read = function(e, t, r, n, o) {
                    var i, s, a = 8 * o - n - 1,
                        u = (1 << a) - 1,
                        c = u >> 1,
                        l = -7,
                        d = r ? o - 1 : 0,
                        f = r ? -1 : 1,
                        p = e[t + d];
                    for (d += f, i = p & (1 << -l) - 1, p >>= -l, l += a; l > 0; i = 256 * i + e[t + d], d += f, l -= 8);
                    for (s = i & (1 << -l) - 1, i >>= -l, l += n; l > 0; s = 256 * s + e[t + d], d += f, l -= 8);
                    if (0 === i) i = 1 - c;
                    else {
                        if (i === u) return s ? NaN : 1 / 0 * (p ? -1 : 1);
                        s += Math.pow(2, n), i -= c
                    }
                    return (p ? -1 : 1) * s * Math.pow(2, i - n)
                }, t.write = function(e, t, r, n, o, i) {
                    var s, a, u, c = 8 * i - o - 1,
                        l = (1 << c) - 1,
                        d = l >> 1,
                        f = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                        p = n ? 0 : i - 1,
                        m = n ? 1 : -1,
                        h = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = l) : (s = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), (t += s + d >= 1 ? f / u : f * Math.pow(2, 1 - d)) * u >= 2 && (s++, u /= 2), s + d >= l ? (a = 0, s = l) : s + d >= 1 ? (a = (t * u - 1) * Math.pow(2, o), s += d) : (a = t * Math.pow(2, d - 1) * Math.pow(2, o), s = 0)); o >= 8; e[r + p] = 255 & a, p += m, a /= 256, o -= 8);
                    for (s = s << o | a, c += o; c > 0; e[r + p] = 255 & s, p += m, s /= 256, c -= 8);
                    e[r + p - m] |= 128 * h
                }
            },
            7824: e => {
                var t = 1e3,
                    r = 60 * t,
                    n = 60 * r,
                    o = 24 * n;

                function i(e, t, r, n) {
                    var o = t >= 1.5 * r;
                    return Math.round(e / r) + " " + n + (o ? "s" : "")
                }
                e.exports = function(e, s) {
                    s = s || {};
                    var a, u, c = typeof e;
                    if ("string" === c && e.length > 0) return function(e) {
                        if (!((e = String(e)).length > 100)) {
                            var i = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
                            if (i) {
                                var s = parseFloat(i[1]);
                                switch ((i[2] || "ms").toLowerCase()) {
                                    case "years":
                                    case "year":
                                    case "yrs":
                                    case "yr":
                                    case "y":
                                        return 315576e5 * s;
                                    case "weeks":
                                    case "week":
                                    case "w":
                                        return 6048e5 * s;
                                    case "days":
                                    case "day":
                                    case "d":
                                        return s * o;
                                    case "hours":
                                    case "hour":
                                    case "hrs":
                                    case "hr":
                                    case "h":
                                        return s * n;
                                    case "minutes":
                                    case "minute":
                                    case "mins":
                                    case "min":
                                    case "m":
                                        return s * r;
                                    case "seconds":
                                    case "second":
                                    case "secs":
                                    case "sec":
                                    case "s":
                                        return s * t;
                                    case "milliseconds":
                                    case "millisecond":
                                    case "msecs":
                                    case "msec":
                                    case "ms":
                                        return s;
                                    default:
                                        return
                                }
                            }
                        }
                    }(e);
                    if ("number" === c && isFinite(e)) return s.long ? (a = e, (u = Math.abs(a)) >= o ? i(a, u, o, "day") : u >= n ? i(a, u, n, "hour") : u >= r ? i(a, u, r, "minute") : u >= t ? i(a, u, t, "second") : a + " ms") : function(e) {
                        var i = Math.abs(e);
                        return i >= o ? Math.round(e / o) + "d" : i >= n ? Math.round(e / n) + "h" : i >= r ? Math.round(e / r) + "m" : i >= t ? Math.round(e / t) + "s" : e + "ms"
                    }(e);
                    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e))
                }
            },
            9932: (e, t, r) => {
                "use strict";
                var n = r(8764).Buffer;
                const o = r(1504);
                e.exports = e => {
                    if (!o(e)) return !1;
                    const t = e.trim().match(o.regex),
                        r = {};
                    if (t[1]) {
                        r.mediaType = t[1].toLowerCase();
                        const e = t[1].split(";").map((e => e.toLowerCase()));
                        r.contentType = e[0], e.slice(1).forEach((e => {
                            const t = e.split("=");
                            r[t[0]] = t[1]
                        }))
                    }
                    return r.base64 = !!t[t.length - 2], r.data = t[t.length - 1] || "", r.toBuffer = () => {
                        const e = r.base64 ? "base64" : "utf8";
                        return n.from(r.data, e)
                    }, r
                }
            },
            7279: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.EndOfStreamError = t.defaultMessages = void 0, t.defaultMessages = "End-Of-Stream";
                class r extends Error {
                    constructor() {
                        super(t.defaultMessages)
                    }
                }
                t.EndOfStreamError = r
            },
            5167: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.StreamReader = t.EndOfStreamError = void 0;
                const n = r(7279);
                var o = r(7279);
                Object.defineProperty(t, "EndOfStreamError", {
                    enumerable: !0,
                    get: function() {
                        return o.EndOfStreamError
                    }
                });
                class i {
                    constructor() {
                        this.resolve = () => null, this.reject = () => null, this.promise = new Promise(((e, t) => {
                            this.reject = t, this.resolve = e
                        }))
                    }
                }
                t.StreamReader = class {
                    constructor(e) {
                        if (this.s = e, this.request = null, this.endOfStream = !1, this.peekQueue = [], !e.read || !e.once) throw new Error("Expected an instance of stream.Readable");
                        this.s.once("end", (() => this.reject(new n.EndOfStreamError))), this.s.once("error", (e => this.reject(e))), this.s.once("close", (() => this.reject(new Error("Stream closed"))))
                    }
                    async peek(e, t, r) {
                        const n = await this.read(e, t, r);
                        return this.peekQueue.push(e.subarray(t, t + n)), n
                    }
                    async read(e, t, r) {
                        if (0 === r) return 0;
                        if (0 === this.peekQueue.length && this.endOfStream) throw new n.EndOfStreamError;
                        let o = r,
                            i = 0;
                        for (; this.peekQueue.length > 0 && o > 0;) {
                            const r = this.peekQueue.pop();
                            if (!r) throw new Error("peekData should be defined");
                            const n = Math.min(r.length, o);
                            e.set(r.subarray(0, n), t + i), i += n, o -= n, n < r.length && this.peekQueue.push(r.subarray(n))
                        }
                        for (; o > 0 && !this.endOfStream;) {
                            const r = Math.min(o, 1048576),
                                n = await this._read(e, t + i, r);
                            if (i += n, n < r) break;
                            o -= n
                        }
                        return i
                    }
                    async _read(e, t, r) {
                        if (this.request) throw new Error("Concurrent read operation?");
                        const n = this.s.read(r);
                        return n ? (e.set(n, t), n.length) : (this.request = {
                            buffer: e,
                            offset: t,
                            length: r,
                            deferred: new i
                        }, this.s.once("readable", (() => {
                            this.tryRead()
                        })), this.request.deferred.promise)
                    }
                    tryRead() {
                        if (!this.request) throw new Error("this.request should be defined");
                        const e = this.s.read(this.request.length);
                        e ? (this.request.buffer.set(e, this.request.offset), this.request.deferred.resolve(e.length), this.request = null) : this.s.once("readable", (() => {
                            this.tryRead()
                        }))
                    }
                    reject(e) {
                        this.endOfStream = !0, this.request && (this.request.deferred.reject(e), this.request = null)
                    }
                }
            },
            842: (e, t, r) => {
                "use strict";
                var n = r(8764).Buffer;
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AbstractTokenizer = void 0;
                const o = r(5167);
                t.AbstractTokenizer = class {
                    constructor(e) {
                        this.position = 0, this.numBuffer = new Uint8Array(8), this.fileInfo = e || {}
                    }
                    async readToken(e, t = this.position) {
                        const r = n.alloc(e.len);
                        if (await this.readBuffer(r, {
                                position: t
                            }) < e.len) throw new o.EndOfStreamError;
                        return e.get(r, 0)
                    }
                    async peekToken(e, t = this.position) {
                        const r = n.alloc(e.len);
                        if (await this.peekBuffer(r, {
                                position: t
                            }) < e.len) throw new o.EndOfStreamError;
                        return e.get(r, 0)
                    }
                    async readNumber(e) {
                        if (await this.readBuffer(this.numBuffer, {
                                length: e.len
                            }) < e.len) throw new o.EndOfStreamError;
                        return e.get(this.numBuffer, 0)
                    }
                    async peekNumber(e) {
                        if (await this.peekBuffer(this.numBuffer, {
                                length: e.len
                            }) < e.len) throw new o.EndOfStreamError;
                        return e.get(this.numBuffer, 0)
                    }
                    async ignore(e) {
                        if (void 0 !== this.fileInfo.size) {
                            const t = this.fileInfo.size - this.position;
                            if (e > t) return this.position += t, t
                        }
                        return this.position += e, e
                    }
                    async close() {}
                    normalizeOptions(e, t) {
                        if (t && void 0 !== t.position && t.position < this.position) throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
                        return t ? {
                            mayBeLess: !0 === t.mayBeLess,
                            offset: t.offset ? t.offset : 0,
                            length: t.length ? t.length : e.length - (t.offset ? t.offset : 0),
                            position: t.position ? t.position : this.position
                        } : {
                            mayBeLess: !1,
                            offset: 0,
                            length: e.length,
                            position: this.position
                        }
                    }
                }
            },
            778: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.BufferTokenizer = void 0;
                const n = r(5167),
                    o = r(842);
                class i extends o.AbstractTokenizer {
                    constructor(e, t) {
                        super(t), this.uint8Array = e, this.fileInfo.size = this.fileInfo.size ? this.fileInfo.size : e.length
                    }
                    async readBuffer(e, t) {
                        if (t && t.position) {
                            if (t.position < this.position) throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
                            this.position = t.position
                        }
                        const r = await this.peekBuffer(e, t);
                        return this.position += r, r
                    }
                    async peekBuffer(e, t) {
                        const r = this.normalizeOptions(e, t),
                            o = Math.min(this.uint8Array.length - r.position, r.length);
                        if (!r.mayBeLess && o < r.length) throw new n.EndOfStreamError;
                        return e.set(this.uint8Array.subarray(r.position, r.position + o), r.offset), o
                    }
                    async close() {}
                }
                t.BufferTokenizer = i
            },
            7859: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.fromFile = t.FileTokenizer = void 0;
                const n = r(842),
                    o = r(5167),
                    i = r(7209);
                class s extends n.AbstractTokenizer {
                    constructor(e, t) {
                        super(t), this.fd = e
                    }
                    async readBuffer(e, t) {
                        const r = this.normalizeOptions(e, t);
                        this.position = r.position;
                        const n = await i.read(this.fd, e, r.offset, r.length, r.position);
                        if (this.position += n.bytesRead, n.bytesRead < r.length && (!t || !t.mayBeLess)) throw new o.EndOfStreamError;
                        return n.bytesRead
                    }
                    async peekBuffer(e, t) {
                        const r = this.normalizeOptions(e, t),
                            n = await i.read(this.fd, e, r.offset, r.length, r.position);
                        if (!r.mayBeLess && n.bytesRead < r.length) throw new o.EndOfStreamError;
                        return n.bytesRead
                    }
                    async close() {
                        return i.close(this.fd)
                    }
                }
                t.FileTokenizer = s, t.fromFile = async function(e) {
                    const t = await i.stat(e);
                    if (!t.isFile) throw new Error(`File not a file: ${e}`);
                    const r = await i.open(e, "r");
                    return new s(r, {
                        path: e,
                        size: t.size
                    })
                }
            },
            7209: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.readFile = t.writeFileSync = t.writeFile = t.read = t.open = t.close = t.stat = t.createReadStream = t.pathExists = void 0;
                const n = r(4059);
                t.pathExists = n.existsSync, t.createReadStream = n.createReadStream, t.stat = async function(e) {
                    return new Promise(((t, r) => {
                        n.stat(e, ((e, n) => {
                            e ? r(e) : t(n)
                        }))
                    }))
                }, t.close = async function(e) {
                    return new Promise(((t, r) => {
                        n.close(e, (e => {
                            e ? r(e) : t()
                        }))
                    }))
                }, t.open = async function(e, t) {
                    return new Promise(((r, o) => {
                        n.open(e, t, ((e, t) => {
                            e ? o(e) : r(t)
                        }))
                    }))
                }, t.read = async function(e, t, r, o, i) {
                    return new Promise(((s, a) => {
                        n.read(e, t, r, o, i, ((e, t, r) => {
                            e ? a(e) : s({
                                bytesRead: t,
                                buffer: r
                            })
                        }))
                    }))
                }, t.writeFile = async function(e, t) {
                    return new Promise(((r, o) => {
                        n.writeFile(e, t, (e => {
                            e ? o(e) : r()
                        }))
                    }))
                }, t.writeFileSync = function(e, t) {
                    n.writeFileSync(e, t)
                }, t.readFile = async function(e) {
                    return new Promise(((t, r) => {
                        n.readFile(e, ((e, n) => {
                            e ? r(e) : t(n)
                        }))
                    }))
                }
            },
            599: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.ReadStreamTokenizer = void 0;
                const n = r(842),
                    o = r(5167);
                class i extends n.AbstractTokenizer {
                    constructor(e, t) {
                        super(t), this.streamReader = new o.StreamReader(e)
                    }
                    async getFileInfo() {
                        return this.fileInfo
                    }
                    async readBuffer(e, t) {
                        const r = this.normalizeOptions(e, t),
                            n = r.position - this.position;
                        if (n > 0) return await this.ignore(n), this.readBuffer(e, t);
                        if (n < 0) throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
                        if (0 === r.length) return 0;
                        const i = await this.streamReader.read(e, r.offset, r.length);
                        if (this.position += i, (!t || !t.mayBeLess) && i < r.length) throw new o.EndOfStreamError;
                        return i
                    }
                    async peekBuffer(e, t) {
                        const r = this.normalizeOptions(e, t);
                        let n = 0;
                        if (r.position) {
                            const t = r.position - this.position;
                            if (t > 0) {
                                const o = new Uint8Array(r.length + t);
                                return n = await this.peekBuffer(o, {
                                    mayBeLess: r.mayBeLess
                                }), e.set(o.subarray(t), r.offset), n - t
                            }
                            if (t < 0) throw new Error("Cannot peek from a negative offset in a stream")
                        }
                        if (r.length > 0) {
                            try {
                                n = await this.streamReader.peek(e, r.offset, r.length)
                            } catch (e) {
                                if (t && t.mayBeLess && e instanceof o.EndOfStreamError) return 0;
                                throw e
                            }
                            if (!r.mayBeLess && n < r.length) throw new o.EndOfStreamError
                        }
                        return n
                    }
                    async ignore(e) {
                        const t = Math.min(256e3, e),
                            r = new Uint8Array(t);
                        let n = 0;
                        for (; n < e;) {
                            const o = e - n,
                                i = await this.readBuffer(r, {
                                    length: Math.min(t, o)
                                });
                            if (i < 0) return i;
                            n += i
                        }
                        return n
                    }
                }
                t.ReadStreamTokenizer = i
            },
            5849: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.fromBuffer = t.fromStream = t.EndOfStreamError = void 0;
                const n = r(599),
                    o = r(778);
                var i = r(5167);
                Object.defineProperty(t, "EndOfStreamError", {
                    enumerable: !0,
                    get: function() {
                        return i.EndOfStreamError
                    }
                }), t.fromStream = function(e, t) {
                    return t = t || {}, new n.ReadStreamTokenizer(e, t)
                }, t.fromBuffer = function(e, t) {
                    return new o.BufferTokenizer(e, t)
                }
            },
            6597: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.fromStream = t.fromBuffer = t.EndOfStreamError = t.fromFile = void 0;
                const n = r(7209),
                    o = r(5849);
                var i = r(7859);
                Object.defineProperty(t, "fromFile", {
                    enumerable: !0,
                    get: function() {
                        return i.fromFile
                    }
                });
                var s = r(5849);
                Object.defineProperty(t, "EndOfStreamError", {
                    enumerable: !0,
                    get: function() {
                        return s.EndOfStreamError
                    }
                }), Object.defineProperty(t, "fromBuffer", {
                    enumerable: !0,
                    get: function() {
                        return s.fromBuffer
                    }
                }), t.fromStream = async function(e, t) {
                    if (t = t || {}, e.path) {
                        const r = await n.stat(e.path);
                        t.path = e.path, t.size = r.size
                    }
                    return o.fromStream(e, t)
                }
            },
            3416: (e, t, r) => {
                "use strict";
                var n = r(8764).Buffer;
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AnsiStringType = t.StringType = t.BufferType = t.Uint8ArrayType = t.IgnoreType = t.Float80_LE = t.Float80_BE = t.Float64_LE = t.Float64_BE = t.Float32_LE = t.Float32_BE = t.Float16_LE = t.Float16_BE = t.INT64_BE = t.UINT64_BE = t.INT64_LE = t.UINT64_LE = t.INT32_LE = t.INT32_BE = t.INT24_BE = t.INT24_LE = t.INT16_LE = t.INT16_BE = t.INT8 = t.UINT32_BE = t.UINT32_LE = t.UINT24_BE = t.UINT24_LE = t.UINT16_BE = t.UINT16_LE = t.UINT8 = void 0;
                const o = r(645);

                function i(e) {
                    return new DataView(e.buffer, e.byteOffset)
                }
                t.UINT8 = {
                    len: 1,
                    get: (e, t) => i(e).getUint8(t),
                    put: (e, t, r) => (i(e).setUint8(t, r), t + 1)
                }, t.UINT16_LE = {
                    len: 2,
                    get: (e, t) => i(e).getUint16(t, !0),
                    put: (e, t, r) => (i(e).setUint16(t, r, !0), t + 2)
                }, t.UINT16_BE = {
                    len: 2,
                    get: (e, t) => i(e).getUint16(t),
                    put: (e, t, r) => (i(e).setUint16(t, r), t + 2)
                }, t.UINT24_LE = {
                    len: 3,
                    get(e, t) {
                        const r = i(e);
                        return r.getUint8(t) + (r.getUint16(t + 1, !0) << 8)
                    },
                    put(e, t, r) {
                        const n = i(e);
                        return n.setUint8(t, 255 & r), n.setUint16(t + 1, r >> 8, !0), t + 3
                    }
                }, t.UINT24_BE = {
                    len: 3,
                    get(e, t) {
                        const r = i(e);
                        return (r.getUint16(t) << 8) + r.getUint8(t + 2)
                    },
                    put(e, t, r) {
                        const n = i(e);
                        return n.setUint16(t, r >> 8), n.setUint8(t + 2, 255 & r), t + 3
                    }
                }, t.UINT32_LE = {
                    len: 4,
                    get: (e, t) => i(e).getUint32(t, !0),
                    put: (e, t, r) => (i(e).setUint32(t, r, !0), t + 4)
                }, t.UINT32_BE = {
                    len: 4,
                    get: (e, t) => i(e).getUint32(t),
                    put: (e, t, r) => (i(e).setUint32(t, r), t + 4)
                }, t.INT8 = {
                    len: 1,
                    get: (e, t) => i(e).getInt8(t),
                    put: (e, t, r) => (i(e).setInt8(t, r), t + 2)
                }, t.INT16_BE = {
                    len: 2,
                    get: (e, t) => i(e).getInt16(t),
                    put: (e, t, r) => (i(e).setInt16(t, r), t + 2)
                }, t.INT16_LE = {
                    len: 2,
                    get: (e, t) => i(e).getInt16(t, !0),
                    put: (e, t, r) => (i(e).setInt16(t, r, !0), t + 2)
                }, t.INT24_LE = {
                    len: 3,
                    get(e, r) {
                        const n = t.UINT24_LE.get(e, r);
                        return n > 8388607 ? n - 16777216 : n
                    },
                    put(e, t, r) {
                        const n = i(e);
                        return n.setUint8(t, 255 & r), n.setUint16(t + 1, r >> 8, !0), t + 3
                    }
                }, t.INT24_BE = {
                    len: 3,
                    get(e, r) {
                        const n = t.UINT24_BE.get(e, r);
                        return n > 8388607 ? n - 16777216 : n
                    },
                    put(e, t, r) {
                        const n = i(e);
                        return n.setUint16(t, r >> 8), n.setUint8(t + 2, 255 & r), t + 3
                    }
                }, t.INT32_BE = {
                    len: 4,
                    get: (e, t) => i(e).getInt32(t),
                    put: (e, t, r) => (i(e).setInt32(t, r), t + 4)
                }, t.INT32_LE = {
                    len: 4,
                    get: (e, t) => i(e).getInt32(t, !0),
                    put: (e, t, r) => (i(e).setInt32(t, r, !0), t + 4)
                }, t.UINT64_LE = {
                    len: 8,
                    get: (e, t) => i(e).getBigUint64(t, !0),
                    put: (e, t, r) => (i(e).setBigUint64(t, r, !0), t + 8)
                }, t.INT64_LE = {
                    len: 8,
                    get: (e, t) => i(e).getBigInt64(t, !0),
                    put: (e, t, r) => (i(e).setBigInt64(t, r, !0), t + 8)
                }, t.UINT64_BE = {
                    len: 8,
                    get: (e, t) => i(e).getBigUint64(t),
                    put: (e, t, r) => (i(e).setBigUint64(t, r), t + 8)
                }, t.INT64_BE = {
                    len: 8,
                    get: (e, t) => i(e).getBigInt64(t),
                    put: (e, t, r) => (i(e).setBigInt64(t, r), t + 8)
                }, t.Float16_BE = {
                    len: 2,
                    get(e, t) {
                        return o.read(e, t, !1, 10, this.len)
                    },
                    put(e, t, r) {
                        return o.write(e, r, t, !1, 10, this.len), t + this.len
                    }
                }, t.Float16_LE = {
                    len: 2,
                    get(e, t) {
                        return o.read(e, t, !0, 10, this.len)
                    },
                    put(e, t, r) {
                        return o.write(e, r, t, !0, 10, this.len), t + this.len
                    }
                }, t.Float32_BE = {
                    len: 4,
                    get: (e, t) => i(e).getFloat32(t),
                    put: (e, t, r) => (i(e).setFloat32(t, r), t + 4)
                }, t.Float32_LE = {
                    len: 4,
                    get: (e, t) => i(e).getFloat32(t, !0),
                    put: (e, t, r) => (i(e).setFloat32(t, r, !0), t + 4)
                }, t.Float64_BE = {
                    len: 8,
                    get: (e, t) => i(e).getFloat64(t),
                    put: (e, t, r) => (i(e).setFloat64(t, r), t + 8)
                }, t.Float64_LE = {
                    len: 8,
                    get: (e, t) => i(e).getFloat64(t, !0),
                    put: (e, t, r) => (i(e).setFloat64(t, r, !0), t + 8)
                }, t.Float80_BE = {
                    len: 10,
                    get(e, t) {
                        return o.read(e, t, !1, 63, this.len)
                    },
                    put(e, t, r) {
                        return o.write(e, r, t, !1, 63, this.len), t + this.len
                    }
                }, t.Float80_LE = {
                    len: 10,
                    get(e, t) {
                        return o.read(e, t, !0, 63, this.len)
                    },
                    put(e, t, r) {
                        return o.write(e, r, t, !0, 63, this.len), t + this.len
                    }
                }, t.IgnoreType = class {
                    constructor(e) {
                        this.len = e
                    }
                    get(e, t) {}
                }, t.Uint8ArrayType = class {
                    constructor(e) {
                        this.len = e
                    }
                    get(e, t) {
                        return e.subarray(t, t + this.len)
                    }
                }, t.BufferType = class {
                    constructor(e) {
                        this.len = e
                    }
                    get(e, t) {
                        return e.slice(t, t + this.len)
                    }
                }, t.StringType = class {
                    constructor(e, t) {
                        this.len = e, this.encoding = t
                    }
                    get(e, t) {
                        return n.from(e).toString(this.encoding, t, t + this.len)
                    }
                };
                class s {
                    constructor(e) {
                        this.len = e
                    }
                    static decode(e, t, r) {
                        let n = "";
                        for (let o = t; o < r; ++o) n += s.codePointToString(s.singleByteDecoder(e[o]));
                        return n
                    }
                    static inRange(e, t, r) {
                        return t <= e && e <= r
                    }
                    static codePointToString(e) {
                        return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode(55296 + (e >> 10), 56320 + (1023 & e)))
                    }
                    static singleByteDecoder(e) {
                        if (s.inRange(e, 0, 127)) return e;
                        const t = s.windows1252[e - 128];
                        if (null === t) throw Error("invaliding encoding");
                        return t
                    }
                    get(e, t = 0) {
                        return s.decode(e, t, t + this.len)
                    }
                }
                t.AnsiStringType = s, s.windows1252 = [8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, 157, 382, 376, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255]
            },
            9903: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.assertGetChat = t.assertFindChat = t.InvalidChat = void 0;
                const n = r(3607),
                    o = r(8910);
                class i extends o.WPPError {
                    constructor(e) {
                        super("chat_not_found", `Chat not found for ${e}`), this.id = e
                    }
                }
                t.InvalidChat = i, t.assertFindChat = async function(e) {
                    const t = await n.chat.find(e);
                    if (!t) throw new i(e);
                    return t
                }, t.assertGetChat = function(e) {
                    const t = n.chat.get(e);
                    if (!t) throw new i(e);
                    return t
                }
            },
            7676: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.assertColor = t.InvalidColor = void 0;
                const n = r(8910);
                class o extends n.WPPError {
                    constructor(e) {
                        super("invalid_color", `Invalid Color value for ${e}`), this.color = e
                    }
                }
                t.InvalidColor = o, t.assertColor = function(e) {
                    let t;
                    if ("number" == typeof e) t = e > 0 ? e : 4294967295 + Number(e) + 1;
                    else {
                        if ("string" != typeof e) throw new o(e); {
                            let r = e.trim().replace("#", "");
                            r.length <= 6 && (r = "FF" + r.padStart(6, "0")), t = parseInt(r, 16)
                        }
                    }
                    return t
                }
            },
            4578: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.assertIsBusiness = t.NotIsBusinessError = void 0;
                const n = r(8910),
                    o = r(1092);
                class i extends n.WPPError {
                    constructor() {
                        super("is_not_business", "This account is not a business version")
                    }
                }
                t.NotIsBusinessError = i, t.assertIsBusiness = function() {
                    if (!o.Conn.isSMB) throw new i
                }
            },
            4434: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.assertWid = t.InvalidWid = void 0;
                const n = r(8910);
                class o extends n.WPPError {
                    constructor(e) {
                        super("invalid_wid", `Invalid WID value for ${e}`), this.id = e
                    }
                }
                t.InvalidWid = o, t.assertWid = function(e) {
                    const t = (0, n.createWid)(e);
                    if (!t) throw new o(e);
                    return t
                }
            },
            3327: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(9903), t), o(r(7676), t), o(r(4578), t), o(r(4434), t)
            },
            7557: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(4457)
            },
            4457: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092);
                a.onInjected((() => {
                    u.BlocklistStore.on("sort", (() => {
                        s.internalEv.emit("blocklist.sync")
                    }))
                }))
            },
            9509: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.all = void 0;
                const n = r(1092);
                t.all = function() {
                    return n.BlocklistStore.models.map((e => e.id))
                }
            },
            9783: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.blockContact = void 0;
                const s = r(3327),
                    a = r(1092),
                    u = i(r(1489));
                t.blockContact = async function(e) {
                    const t = (0, s.assertWid)(e),
                        r = a.ContactStore.get(t) || new a.ContactModel({
                            id: t
                        });
                    return await u.blockContact(r), {
                        wid: t,
                        isBlocked: r.isBlocked()
                    }
                }
            },
            2820: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.unblockContact = t.isBlocked = t.blockContact = t.all = void 0;
                var n = r(9509);
                Object.defineProperty(t, "all", {
                    enumerable: !0,
                    get: function() {
                        return n.all
                    }
                });
                var o = r(9783);
                Object.defineProperty(t, "blockContact", {
                    enumerable: !0,
                    get: function() {
                        return o.blockContact
                    }
                });
                var i = r(6139);
                Object.defineProperty(t, "isBlocked", {
                    enumerable: !0,
                    get: function() {
                        return i.isBlocked
                    }
                });
                var s = r(1677);
                Object.defineProperty(t, "unblockContact", {
                    enumerable: !0,
                    get: function() {
                        return s.unblockContact
                    }
                })
            },
            6139: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isBlocked = void 0;
                const n = r(3327),
                    o = r(1092);
                t.isBlocked = function(e) {
                    const t = (0, n.assertWid)(e);
                    return (o.ContactStore.get(t) || new o.ContactModel({
                        id: t
                    })).isBlocked()
                }
            },
            1677: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.unblockContact = void 0;
                const s = r(3327),
                    a = r(1092),
                    u = i(r(1489));
                t.unblockContact = async function(e) {
                    const t = (0, s.assertWid)(e),
                        r = a.ContactStore.get(t) || new a.ContactModel({
                            id: t
                        });
                    return await u.unblockContact(r), {
                        wid: t,
                        isBlocked: r.isBlocked()
                    }
                }
            },
            5140: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(7557), o(r(2820), t)
            },
            443: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.defaultSendMessageOptions = void 0, t.defaultSendMessageOptions = {
                    createChat: !1,
                    detectMentioned: !0,
                    linkPreview: !0,
                    markIsRead: !0,
                    waitForAck: !0
                }
            },
            1412: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(4278), r(145), r(7248), r(7207), r(3728)
            },
            4278: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092),
                    c = r(8785),
                    l = r(1489);

                function d(e) {
                    let t = e.id;
                    Array.isArray(t) || (t = [t]);
                    let r = e.to,
                        n = e.participant;
                    e.broadcast && (r = e.broadcast, n = e.to);
                    const o = t.map((t => new u.MsgKey({
                        from: e.from,
                        to: r,
                        id: t,
                        selfDir: "out"
                    })));
                    s.internalEv.emit("chat.msg_ack_change", {
                        ack: e.ack,
                        chat: r,
                        sender: n,
                        ids: o
                    })
                }
                a.onInjected((() => function() {
                    u.MsgStore.on("change:ack", (e => {
                        1 === e.ack && s.internalEv.emit("chat.msg_ack_change", {
                            ack: e.ack,
                            chat: e.to,
                            ids: [e.id]
                        })
                    }));
                    const e = a.search((e => e.default.toString().includes("Msg:out of order ack")));
                    if (e) {
                        const t = e.default;
                        e.default = async([r]) => ("ack" !== r.cmd && "acks" !== r.cmd || d(r), t.call(e, [r]))
                    }
                    const t = a.search((e => e.default.toString().includes("ack") && e.default.toString().includes("acks") && e.default.toString().includes("default.updateInfo")));
                    if (t) {
                        const r = t.default;
                        t.default = async([t]) => ("ack" !== t.cmd && "acks" !== t.cmd || d(t), r.call(e, [t]))
                    }

                    function r(e) {
                        if (e.ack < 2 || "sender" === e.ackString) return;
                        const t = e.from,
                            r = e.participant || void 0,
                            n = e.recipient || e.from,
                            o = n.equals(u.UserPrefs.getMeUser()),
                            i = e.externalIds.map((e => new u.MsgKey({
                                id: e,
                                remote: n,
                                fromMe: o
                            })));
                        s.internalEv.emit("chat.msg_ack_change", {
                            ack: e.ack,
                            chat: t,
                            sender: r,
                            ids: i
                        })
                    }
                    // (0, c.wrapModuleFunction)(l.handleChatSimpleAck, ((e, ...t) => {
                    //     const [n] = t;
                    //     return r(n), e(...t)
                    // })), (0, c.wrapModuleFunction)(l.handleGroupSimpleAck, ((e, ...t) => {
                    //     const [n] = t;
                    //     return r(n), e(...t)
                    // })), (0, c.wrapModuleFunction)(l.handleStatusSimpleAck, ((e, ...t) => {
                    //     const [n] = t;
                    //     return r(n), e(...t)
                    // }))
                }()))
            },
            145: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(8913),
                    a = r(5267),
                    u = i(r(7046)),
                    c = r(1092);
                u.onInjected((() => function() {
                    c.MsgStore.on("add", (e => {
                        e.isNewMsg && e.isLive && (a.internalEv.emit("chat.live_location_start", {
                            id: e.sender,
                            msgId: e.id,
                            chat: e.chat.id,
                            lat: e.lat,
                            lng: e.lng,
                            accuracy: e.accuracy,
                            speed: e.speed,
                            degrees: e.degrees,
                            shareDuration: e.shareDuration
                        }), c.LiveLocationStore.update(e.chat.id).then((e => {
                            e.startViewingMap()
                        })).catch((() => null)))
                    })), c.ChatStore.once("collection_has_synced", (() => {
                        c.ChatStore.models.slice(0, s.config.liveLocationLimit).forEach((e => {
                            c.LiveLocationStore.update(e.id).then((e => {
                                e.startViewingMap()
                            })).catch((() => null))
                        }))
                    }));
                    const e = c.LiveLocationStore.handle;
                    c.LiveLocationStore.handle = t => {
                        for (const e of t) "update" !== (r = e).type ? "disable" !== r.type || a.internalEv.emit("chat.live_location_end", {
                            id: r.jid,
                            chat: r.chat,
                            seq: r.seq
                        }) : a.internalEv.emit("chat.live_location_update", {
                            id: r.jid,
                            lastUpdated: c.Clock.globalUnixTime() - r.elapsed,
                            elapsed: r.elapsed,
                            lat: r.lat,
                            lng: r.lng,
                            accuracy: r.accuracy,
                            speed: r.speed,
                            degrees: r.degrees,
                            comment: r.body
                        });
                        var r;
                        return e.call(e, t)
                    }
                }()))
            },
            7248: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092);
                a.onInjected((() => {
                    u.MsgStore.on("add", (e => {
                        e.isNewMsg && s.internalEv.emit("chat.new_message", e)
                    }))
                }))
            },
            7207: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092);
                a.onInjected((() => {
                    u.PresenceStore.on("change:chatstate.type", (e => {
                        var t;
                        const r = u.PresenceStore.models.find((t => t.chatstate === e));
                        if (!r || !r.hasData || !(null === (t = r.chatstate) || void 0 === t ? void 0 : t.type)) return;
                        const n = u.ContactStore.get(r.id),
                            o = {
                                id: r.id,
                                isOnline: r.isOnline,
                                isGroup: r.isGroup,
                                isUser: r.isUser,
                                shortName: n ? n.formattedShortName : "",
                                state: r.chatstate.type,
                                t: Date.now()
                            };
                        r.isUser && (o.isContact = !r.chatstate.deny), r.isGroup && (o.participants = r.chatstates.models.filter((e => !!e.type)).map((e => {
                            const t = u.ContactStore.get(e.id);
                            return {
                                id: e.id.toString(),
                                state: e.type,
                                shortName: t ? t.formattedShortName : ""
                            }
                        }))), s.internalEv.emit("chat.presence_change", o)
                    }))
                })), s.internalEv.on("conn.main_ready", (() => {
                    u.ChatStore.forEach((e => e.presence.subscribe()))
                }))
            },
            3728: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092);
                a.onInjected((() => function() {
                    const e = u.MsgStore.processMultipleMessages,
                        t = ["revoke", "sender_revoke", "admin_revoke"];
                    u.MsgStore.processMultipleMessages = (r, n, ...o) => new Promise(((i, a) => {
                        try {
                            for (const e of n) e.isNewMsg && "protocol" === e.type && t.includes(e.subtype) && s.internalEv.emit("chat.msg_revoke", {
                                author: e.author,
                                from: e.from,
                                id: e.id,
                                refId: e.protocolMessageKey,
                                to: e.to,
                                type: e.subtype
                            })
                        } catch (e) {}
                        e.call(u.MsgStore, r, n, ...o).then(i, a)
                    }))
                }()))
            },
            1314: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.canMute = void 0;
                const n = r(3327);
                t.canMute = function(e) {
                    const t = (0, n.assertWid)(e);
                    return (0, n.assertGetChat)(t).mute.canMute()
                }
            },
            6534: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.clear = void 0;
                const n = r(3327),
                    o = r(1489);
                t.clear = async function(e, t = !0) {
                    const r = (0, n.assertWid)(e),
                        i = (0, n.assertGetChat)(r);
                    (0, o.sendClear)(i, t);
                    let s = 200;
                    return i.promises.sendClear && (s = (await i.promises.sendClear.catch((() => ({
                        status: 500
                    })))).status || s), {
                        wid: r,
                        status: s,
                        keepStarred: t
                    }
                }
            },
            7814: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.delete = void 0;
                const n = r(3327),
                    o = r(1489);
                t.delete = async function(e) {
                    const t = (0, n.assertWid)(e),
                        r = (0, n.assertGetChat)(t);
                    (0, o.sendDelete)(r);
                    let i = 200;
                    return r.promises.sendDelete && (i = (await r.promises.sendDelete.catch((() => ({
                        status: 500
                    })))).status || i), {
                        wid: t,
                        status: i
                    }
                }
            },
            8826: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.deleteMessage = void 0;
                const n = r(3327),
                    o = r(9428),
                    i = r(758);
                t.deleteMessage = async function(e, t, r = !1, s = !1) {
                    const a = (0, n.assertGetChat)(e);
                    let u = !1;
                    Array.isArray(t) || (u = !0, t = [t]);
                    const c = await (0, i.getMessageById)(t),
                        l = [];
                    for (const e of c) {
                        let t = o.SendMsgResult.ERROR_UNKNOWN,
                            n = !1,
                            i = !1;
                        e.type === o.MSG_TYPE.REVOKED ? (t = o.SendMsgResult.ERROR_UNKNOWN, n = !0) : s ? "function" == typeof a.canSenderRevoke ? (t = await a.sendRevokeMsgs([e], r), t === o.SendMsgResult.OK && (n = !0)) : (t = await a.sendRevokeMsgs([e], "Sender", r), t === o.SendMsgResult.OK && (n = !0)) : (t = await a.sendDeleteMsgs([e], r), t === o.SendMsgResult.OK && (i = !0)), l.push({
                            id: e.id.toString(),
                            sendMsgResult: t,
                            isRevoked: n,
                            isDeleted: i
                        })
                    }
                    return u ? l[0] : l
                }
            },
            3438: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.downloadMedia = void 0;
                const n = r(8910),
                    o = r(1092),
                    i = r(758);
                t.downloadMedia = async function e(t) {
                    var r;
                    const s = await (0, i.getMessageById)(t);
                    if (!s.mediaData) throw new n.WPPError("message_not_contains_media", `Message ${t} not contains media`, {
                        id: t
                    });
                    await s.downloadMedia({
                        downloadEvenIfExpensive: !0,
                        rmrReason: 1,
                        isUserInitiated: !0
                    });
                    let a = null;
                    if (s.mediaData.mediaBlob ? a = s.mediaData.mediaBlob.forceToBlob() : s.mediaData.filehash && (a = o.MediaBlobCache.get(s.mediaData.filehash)), !a && "VIDEO" === (null === (r = s.mediaObject) || void 0 === r ? void 0 : r.type)) try {
                        return s.type = "document", s.mediaObject.type = "DOCUMENT", await e(t)
                    } finally {
                        s.type = "video", s.mediaObject.type = "VIDEO"
                    }
                    if (!a) throw {
                        error: !0,
                        code: "media_not_found",
                        message: "Media not found"
                    };
                    return a
                }
            },
            7242: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.find = void 0;
                const n = r(3327),
                    o = r(1489);
                t.find = async function(e) {
                    const t = (0, n.assertWid)(e);
                    return (0, o.findChat)(t)
                }
            },
            89: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.generateMessageID = void 0;
                const n = r(3327),
                    o = r(1092),
                    i = r(1489);
                t.generateMessageID = function(e) {
                    let t;
                    return t = e instanceof o.Wid ? e : e instanceof o.ChatModel ? e.id : (0, n.assertWid)(e), new o.MsgKey({
                        from: o.UserPrefs.getMaybeMeUser(),
                        to: t,
                        id: (0, i.randomMessageId)(),
                        selfDir: "out"
                    })
                }
            },
            8309: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.get = void 0;
                const n = r(3327),
                    o = r(1092);
                t.get = function(e) {
                    const t = (0, n.assertWid)(e);
                    return o.ChatStore.get(t)
                }
            },
            8491: function(e, t, r) {
                "use strict";
                var n = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getMessageById = void 0;
                const o = n(r(1227)),
                    i = r(3327),
                    s = r(8910),
                    a = r(1092),
                    u = (0, o.default)("WA-JS:message:getMessageById");
                t.getMessageById = async function(e) {
                    let t = !1;
                    Array.isArray(e) || (t = !0, e = [e]);
                    const r = e.map((e => a.MsgKey.fromString(e.toString()))),
                        n = [];
                    for (const e of r) {
                        let t = a.MsgStore.get(e);
                        if (!t) {
                            const r = (0, i.assertGetChat)(e.remote);
                            if (t = r.msgs.get(e), !t) {
                                u(`searching remote message with id ${e.toString()}`);
                                const n = r.getSearchContext(e);
                                await n.collection.loadAroundPromise, t = r.msgs.get(e) || n.collection.get(e)
                            }
                        }
                        if (!t) throw u(`message id ${e.toString()} not found`), new s.WPPError("msg_not_found", `Message ${e.toString()} not found`, {
                            id: e.toString()
                        });
                        n.push(t)
                    }
                    return t ? n[0] : n
                }
            },
            3311: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getMessages = void 0;
                const n = r(3327),
                    o = r(5005),
                    i = r(1092),
                    s = r(1489);
                t.getMessages = async function(e, t = {}) {
                    var r;
                    const a = (0, n.assertGetChat)(e);
                    let u = t.count || 20;
                    const c = "after" === t.direction ? "after" : "before",
                        l = t.id || (null === (r = a.lastReceivedKey) || void 0 === r ? void 0 : r.toString()); - 1 === u && (0, o.isMultiDevice)() && (u = 1 / 0), !t.id && l && u--;
                    const d = l ? i.MsgKey.fromString(l) : {
                        remote: a.id
                    };
                    d.count = u, d.direction = c;
                    const f = await (0, s.msgFindQuery)(c, d);
                    if (!t.id && l) {
                        const e = i.MsgStore.get(l);
                        e && f.push(e.attributes)
                    }
                    return f
                }
            },
            758: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.unmute = t.starMessage = t.sendVCardContactMessage = t.sendTextMessage = t.sendReactionToMessage = t.sendRawMessage = t.sendLocationMessage = t.sendListMessage = t.sendFileMessage = t.prepareRawMessage = t.prepareMessageButtons = t.prepareLinkPreview = t.openChatFromUnread = t.openChatBottom = t.openChatAt = t.mute = t.markIsUnread = t.markIsRecording = t.markIsRead = t.markIsPaused = t.markIsComposing = t.getMessages = t.getMessageById = t.get = t.generateMessageID = t.find = t.downloadMedia = t.deleteMessage = t.delete = t.clear = t.canMute = void 0;
                var n = r(1314);
                Object.defineProperty(t, "canMute", {
                    enumerable: !0,
                    get: function() {
                        return n.canMute
                    }
                });
                var o = r(6534);
                Object.defineProperty(t, "clear", {
                    enumerable: !0,
                    get: function() {
                        return o.clear
                    }
                });
                var i = r(7814);
                Object.defineProperty(t, "delete", {
                    enumerable: !0,
                    get: function() {
                        return i.delete
                    }
                });
                var s = r(8826);
                Object.defineProperty(t, "deleteMessage", {
                    enumerable: !0,
                    get: function() {
                        return s.deleteMessage
                    }
                });
                var a = r(3438);
                Object.defineProperty(t, "downloadMedia", {
                    enumerable: !0,
                    get: function() {
                        return a.downloadMedia
                    }
                });
                var u = r(7242);
                Object.defineProperty(t, "find", {
                    enumerable: !0,
                    get: function() {
                        return u.find
                    }
                });
                var c = r(89);
                Object.defineProperty(t, "generateMessageID", {
                    enumerable: !0,
                    get: function() {
                        return c.generateMessageID
                    }
                });
                var l = r(8309);
                Object.defineProperty(t, "get", {
                    enumerable: !0,
                    get: function() {
                        return l.get
                    }
                });
                var d = r(8491);
                Object.defineProperty(t, "getMessageById", {
                    enumerable: !0,
                    get: function() {
                        return d.getMessageById
                    }
                });
                var f = r(3311);
                Object.defineProperty(t, "getMessages", {
                    enumerable: !0,
                    get: function() {
                        return f.getMessages
                    }
                });
                var p = r(3089);
                Object.defineProperty(t, "markIsComposing", {
                    enumerable: !0,
                    get: function() {
                        return p.markIsComposing
                    }
                });
                var m = r(8292);
                Object.defineProperty(t, "markIsPaused", {
                    enumerable: !0,
                    get: function() {
                        return m.markIsPaused
                    }
                });
                var h = r(9256);
                Object.defineProperty(t, "markIsRead", {
                    enumerable: !0,
                    get: function() {
                        return h.markIsRead
                    }
                });
                var g = r(2818);
                Object.defineProperty(t, "markIsRecording", {
                    enumerable: !0,
                    get: function() {
                        return g.markIsRecording
                    }
                });
                var y = r(5433);
                Object.defineProperty(t, "markIsUnread", {
                    enumerable: !0,
                    get: function() {
                        return y.markIsUnread
                    }
                });
                var b = r(6915);
                Object.defineProperty(t, "mute", {
                    enumerable: !0,
                    get: function() {
                        return b.mute
                    }
                });
                var v = r(9558);
                Object.defineProperty(t, "openChatAt", {
                    enumerable: !0,
                    get: function() {
                        return v.openChatAt
                    }
                });
                var _ = r(4310);
                Object.defineProperty(t, "openChatBottom", {
                    enumerable: !0,
                    get: function() {
                        return _.openChatBottom
                    }
                });
                var M = r(444);
                Object.defineProperty(t, "openChatFromUnread", {
                    enumerable: !0,
                    get: function() {
                        return M.openChatFromUnread
                    }
                });
                var w = r(8471);
                Object.defineProperty(t, "prepareLinkPreview", {
                    enumerable: !0,
                    get: function() {
                        return w.prepareLinkPreview
                    }
                });
                var P = r(9872);
                Object.defineProperty(t, "prepareMessageButtons", {
                    enumerable: !0,
                    get: function() {
                        return P.prepareMessageButtons
                    }
                });
                var O = r(8384);
                Object.defineProperty(t, "prepareRawMessage", {
                    enumerable: !0,
                    get: function() {
                        return O.prepareRawMessage
                    }
                });
                var j = r(18);
                Object.defineProperty(t, "sendFileMessage", {
                    enumerable: !0,
                    get: function() {
                        return j.sendFileMessage
                    }
                });
                var x = r(8851);
                Object.defineProperty(t, "sendListMessage", {
                    enumerable: !0,
                    get: function() {
                        return x.sendListMessage
                    }
                });
                var C = r(2814);
                Object.defineProperty(t, "sendLocationMessage", {
                    enumerable: !0,
                    get: function() {
                        return C.sendLocationMessage
                    }
                });
                var S = r(682);
                Object.defineProperty(t, "sendRawMessage", {
                    enumerable: !0,
                    get: function() {
                        return S.sendRawMessage
                    }
                });
                var I = r(3065);
                Object.defineProperty(t, "sendReactionToMessage", {
                    enumerable: !0,
                    get: function() {
                        return I.sendReactionToMessage
                    }
                });
                var E = r(6627);
                Object.defineProperty(t, "sendTextMessage", {
                    enumerable: !0,
                    get: function() {
                        return E.sendTextMessage
                    }
                });
                var k = r(6017);
                Object.defineProperty(t, "sendVCardContactMessage", {
                    enumerable: !0,
                    get: function() {
                        return k.sendVCardContactMessage
                    }
                });
                var T = r(7709);
                Object.defineProperty(t, "starMessage", {
                    enumerable: !0,
                    get: function() {
                        return T.starMessage
                    }
                });
                var B = r(8205);
                Object.defineProperty(t, "unmute", {
                    enumerable: !0,
                    get: function() {
                        return B.unmute
                    }
                })
            },
            3089: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.markIsComposing = void 0;
                const n = r(3327),
                    o = r(1092),
                    i = r(758);
                t.markIsComposing = async function(e, t) {
                    const r = (0, n.assertGetChat)(e);
                    await r.presence.subscribe(), await o.ChatPresence.markComposing(r), r.pausedTimerId && (clearTimeout(r.pausedTimerId), r.unset("pausedTimerId")), t && (r.pausedTimerId = setTimeout((() => {
                        (0, i.markIsPaused)(e)
                    }), t))
                }
            },
            8292: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.markIsPaused = void 0;
                const n = r(3327),
                    o = r(1092);
                t.markIsPaused = async function(e) {
                    const t = (0, n.assertGetChat)(e);
                    await t.presence.subscribe(), await o.ChatPresence.markPaused(t)
                }
            },
            9256: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.markIsRead = void 0;
                const n = r(3327),
                    o = r(1489);
                t.markIsRead = async function(e) {
                    const t = (0, n.assertGetChat)(e),
                        r = t.unreadCount;
                    return await (0, o.sendSeen)(t, !1), {
                        wid: t.id,
                        unreadCount: r
                    }
                }
            },
            2818: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.markIsRecording = void 0;
                const n = r(3327),
                    o = r(1092),
                    i = r(758);
                t.markIsRecording = async function(e, t) {
                    const r = (0, n.assertGetChat)(e);
                    await r.presence.subscribe(), await o.ChatPresence.markRecording(r), t && (r.pausedTimerId = setTimeout((() => {
                        (0, i.markIsPaused)(e)
                    }), t))
                }
            },
            5433: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.markIsUnread = void 0;
                const n = r(3327),
                    o = r(1489);
                t.markIsUnread = async function(e) {
                    const t = (0, n.assertGetChat)(e);
                    return await (0, o.markUnread)(t, !1), {
                        wid: t.id
                    }
                }
            },
            6915: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.mute = void 0;
                const n = r(3327),
                    o = r(8910),
                    i = r(1092);
                t.mute = async function(e, t) {
                    const r = (0, n.assertWid)(e),
                        s = (0, n.assertGetChat)(r);
                    let a = 0;
                    if ("expiration" in t) a = "number" == typeof t.expiration ? t.expiration : t.expiration.getTime() / 1e3;
                    else {
                        if (!("duration" in t)) throw new o.WPPError("invalid_time_mute", "Invalid time for mute", {
                            time: t
                        });
                        a = i.Clock.globalUnixTime() + t.duration
                    }
                    if (a < i.Clock.globalUnixTime()) throw new o.WPPError("negative_time_mute", "Negative duration for mute", {
                        time: t
                    });
                    return await s.mute.mute(a, !0), {
                        wid: r,
                        expiration: s.mute.expiration,
                        isMuted: s.mute.isMuted
                    }
                }
            },
            9558: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.openChatAt = void 0;
                const n = r(3327),
                    o = r(1092),
                    i = r(758);
                t.openChatAt = async function(e, t) {
                    const r = (0, n.assertWid)(e),
                        s = await (0, n.assertFindChat)(r),
                        a = await (0, i.getMessageById)(t),
                        u = s.getSearchContext(a);
                    return await o.Cmd.openChatAt(s, u)
                }
            },
            4310: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.openChatBottom = void 0;
                const n = r(3327),
                    o = r(1092);
                t.openChatBottom = async function(e) {
                    const t = (0, n.assertWid)(e),
                        r = await (0, n.assertFindChat)(t);
                    return await o.Cmd.openChatBottom(r)
                }
            },
            444: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.openChatFromUnread = void 0;
                const n = r(3327),
                    o = r(1092);
                t.openChatFromUnread = async function(e) {
                    const t = (0, n.assertWid)(e),
                        r = await (0, n.assertFindChat)(t);
                    return await o.Cmd.openChatFromUnread(r)
                }
            },
            8471: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    },
                    s = this && this.__rest || function(e, t) {
                        var r = {};
                        for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
                        if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                            var o = 0;
                            for (n = Object.getOwnPropertySymbols(e); o < n.length; o++) t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]])
                        }
                        return r
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.prepareLinkPreview = void 0;
                const a = r(6299),
                    u = i(r(7046)),
                    c = r(8785),
                    l = r(1489);
                t.prepareLinkPreview = async function(e, t) {
                    if (!t.linkPreview) return e;
                    if (t.linkPreview) {
                        const r = "object" == typeof t.linkPreview ? t.linkPreview : {},
                            n = "chat" === e.type ? e.body : "";
                        if (n) try {
                            const e = (0, l.findFirstWebLink)(n);
                            if (e) {
                                const n = await (0, l.fetchLinkPreview)(e);
                                (null == n ? void 0 : n.data) && (t.linkPreview = Object.assign(Object.assign({}, n.data), r))
                            }
                        } catch (e) {}
                    }
                    return "object" == typeof t.linkPreview && (e.subtype = "url", e = Object.assign(Object.assign({}, e), t.linkPreview)), e
                }, u.onReady((() => {
                    (0, c.wrapModuleFunction)(l.genMinimalLinkPreview, (async(e, ...t) => {
                        const [r] = t;
                        return new Promise((async n => {
                            try {
                                const e = await (0, a.fetchRemoteLinkPreviewData)(r.url);
                                if (!e) throw new Error(`preview not found for ${r.url}`);
                                const {
                                    imageUrl: t
                                } = e, o = s(e, ["imageUrl"]);
                                let i = {};
                                t && (i = await (0, a.generateThumbnailLinkPreviewData)(t).catch((() => null))), n({
                                    url: r.url,
                                    data: Object.assign(Object.assign({}, o), i)
                                })
                            } catch (r) {
                                n(e(...t))
                            }
                        }))
                    }))
                }))
            },
            9872: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.prepareMessageButtons = void 0;
                const s = i(r(7046)),
                    a = r(1092),
                    u = r(8785),
                    c = r(1489);
                t.prepareMessageButtons = function(e, t) {
                    if (!t.buttons) return e;
                    if (!Array.isArray(t.buttons)) throw "Buttons options is not a array";
                    if (void 0 === t.useTemplateButtons && (t.useTemplateButtons = t.buttons.some((e => "phoneNumber" in e || "url" in e))), t.useTemplateButtons) {
                        if (0 === t.buttons.length || t.buttons.length > 5) throw "Buttons options must have between 1 and 5 options"
                    } else if (0 === t.buttons.length || t.buttons.length > 3) throw "Buttons options must have between 1 and 3 options";
                    return e.title = t.title, e.footer = t.footer, t.useTemplateButtons ? (e.isFromTemplate = !0, e.buttons = new a.TemplateButtonCollection, e.hydratedButtons = t.buttons.map(((e, t) => "phoneNumber" in e ? {
                        index: t,
                        callButton: {
                            displayText: e.text,
                            phoneNumber: e.phoneNumber
                        }
                    } : "url" in e ? {
                        index: t,
                        urlButton: {
                            displayText: e.text,
                            url: e.url
                        }
                    } : {
                        index: t,
                        quickReplyButton: {
                            displayText: e.text,
                            id: e.id || `${t}`
                        }
                    })), e.buttons.add(e.hydratedButtons.map(((e, t) => {
                        var r, n, o, i;
                        const s = `${null!=e.index?e.index:t}`;
                        return e.urlButton ? new a.TemplateButtonModel({
                            id: s,
                            displayText: null === (r = e.urlButton) || void 0 === r ? void 0 : r.displayText,
                            url: null === (n = e.urlButton) || void 0 === n ? void 0 : n.url,
                            subtype: "url"
                        }) : e.callButton ? new a.TemplateButtonModel({
                            id: s,
                            displayText: e.callButton.displayText,
                            phoneNumber: e.callButton.phoneNumber,
                            subtype: "call"
                        }) : new a.TemplateButtonModel({
                            id: s,
                            displayText: null === (o = e.quickReplyButton) || void 0 === o ? void 0 : o.displayText,
                            selectionId: null === (i = e.quickReplyButton) || void 0 === i ? void 0 : i.id,
                            subtype: "quick_reply"
                        })
                    })))) : (e.isDynamicReplyButtonsMsg = !0, e.dynamicReplyButtons = t.buttons.map(((e, t) => ({
                        buttonId: e.id || `${t}`,
                        buttonText: {
                            displayText: e.text
                        },
                        type: 1
                    }))), e.replyButtons = new a.ButtonCollection, e.replyButtons.add(e.dynamicReplyButtons.map((e => {
                        var t;
                        return new a.ReplyButtonModel({
                            id: e.buttonId,
                            displayText: (null === (t = e.buttonText) || void 0 === t ? void 0 : t.displayText) || void 0
                        })
                    })))), e
                }, s.onInjected((() => {
                    (0, u.wrapModuleFunction)(c.createMsgProtobuf, ((e, ...t) => {
                        var r;
                        const [n] = t, o = e(...t);
                        if (n.hydratedButtons) {
                            const e = {
                                hydratedButtons: n.hydratedButtons
                            };
                            if (n.footer && (e.hydratedFooterText = n.footer), n.caption && (e.hydratedContentText = n.caption), n.title && (e.hydratedTitleText = n.title), o.conversation) e.hydratedContentText = o.conversation, delete o.conversation;
                            else if (null === (r = o.extendedTextMessage) || void 0 === r ? void 0 : r.text) e.hydratedContentText = o.extendedTextMessage.text, delete o.extendedTextMessage;
                            else {
                                let t;
                                const r = ["documentMessage", "imageMessage", "locationMessage", "videoMessage"];
                                for (const e of r)
                                    if (e in o) {
                                        t = e;
                                        break
                                    }
                                if (!t) return o;
                                e[t] = o[t], e.hydratedTitleText && !e.hydratedContentText && (e.hydratedContentText = e.hydratedTitleText), delete e.hydratedTitleText, "locationMessage" === t && (e.hydratedContentText || !o[t].name && !o[t].address || (e.hydratedContentText = o[t].name && o[t].address ? `${o[t].name}\n${o[t].address}` : o[t].name || o[t].address || "")), e.hydratedContentText = e.hydratedContentText || " ", delete o[t]
                            }
                            o.templateMessage = {
                                hydratedTemplate: e
                            }
                        }
                        return o
                    })), (0, u.wrapModuleFunction)(c.mediaTypeFromProtobuf, ((e, ...t) => {
                        var r;
                        const [n] = t;
                        return (null === (r = n.templateMessage) || void 0 === r ? void 0 : r.hydratedTemplate) ? e(n.templateMessage.hydratedTemplate) : e(...t)
                    })), (0, u.wrapModuleFunction)(c.typeAttributeFromProtobuf, ((e, ...t) => {
                        var r, n;
                        const [o] = t;
                        if (null === (r = o.templateMessage) || void 0 === r ? void 0 : r.hydratedTemplate) {
                            const e = Object.keys(null === (n = o.templateMessage) || void 0 === n ? void 0 : n.hydratedTemplate);
                            return ["documentMessage", "imageMessage", "locationMessage", "videoMessage"].some((t => e.includes(t))) ? "media" : "text"
                        }
                        return e(...t)
                    }))
                }))
            },
            8384: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.prepareRawMessage = void 0;
                const n = r(3327),
                    o = r(8910),
                    i = r(1092),
                    s = r(9428),
                    a = r(8381),
                    u = r(758);
                t.prepareRawMessage = async function(e, t, r = {}) {
                    if (r = Object.assign(Object.assign({}, a.defaultSendMessageOptions), r), t = Object.assign({
                            t: i.Clock.globalUnixTime(),
                            from: i.UserPrefs.getMaybeMeUser(),
                            to: e.id,
                            self: "out",
                            isNewMsg: !0,
                            local: !0,
                            ack: s.ACK.CLOCK
                        }, t), r.messageId) {
                        if ("string" == typeof r.messageId && (r.messageId = i.MsgKey.fromString(r.messageId)), !r.messageId.fromMe) throw new o.WPPError("message_key_is_not_from_me", "Message key is not from me", {
                            messageId: r.messageId.toString()
                        });
                        if (!r.messageId.remote.equals(e.id)) throw new o.WPPError("message_key_remote_id_is_not_same_of_chat", "Message key remote ID is not same of chat", {
                            messageId: r.messageId.toString()
                        });
                        t.id = r.messageId
                    }
                    if (t.id || (t.id = (0, u.generateMessageID)(e)), r.mentionedList && !Array.isArray(r.mentionedList)) throw new o.WPPError("mentioned_list_is_not_array", "The option mentionedList is not an array", {
                        mentionedList: r.mentionedList
                    });
                    if (r.detectMentioned && (!r.mentionedList || !r.mentionedList.length)) {
                        const e = "chat" === t.type ? t.body : t.caption;
                        r.mentionedList = r.mentionedList || [];
                        const o = (null == e ? void 0 : e.match(/(?<=@)(\d+)\b/g)) || [];
                        for (const e of o) r.mentionedList.push((0, n.assertWid)(e))
                    }
                    if (r.mentionedList) {
                        const e = r.mentionedList.map((e => e instanceof i.Wid ? e : (0, n.assertWid)(e)));
                        for (const t of e)
                            if (!t.isUser()) throw new o.WPPError("mentioned_is_not_user", "Mentioned is not an user", {
                                mentionedId: t.toString()
                            });
                        t.mentionedJidList = e
                    }
                    if (r.quotedMsg) {
                        if ("string" == typeof r.quotedMsg && (r.quotedMsg = i.MsgKey.fromString(r.quotedMsg)), r.quotedMsg instanceof i.MsgKey && (r.quotedMsg = await (0, u.getMessageById)(r.quotedMsg)), !(r.quotedMsg instanceof i.MsgModel)) throw new o.WPPError("invalid_quoted_msg", "Invalid quotedMsg", {
                            quotedMsg: r.quotedMsg
                        });
                        if (!r.quotedMsg.canReply()) throw new o.WPPError("quoted_msg_can_not_reply", "QuotedMsg can not reply", {
                            quotedMsg: r.quotedMsg
                        });
                        t = Object.assign(Object.assign({}, t), r.quotedMsg.msgContextInfo(e))
                    }
                    return t
                }
            },
            18: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    },
                    s = this && this.__importDefault || function(e) {
                        return e && e.__esModule ? e : {
                            default: e
                        }
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendFileMessage = void 0;
                const a = s(r(1227)),
                    u = r(3327),
                    c = r(8910),
                    l = r(8930),
                    d = i(r(7046)),
                    f = r(1092),
                    p = r(8785),
                    m = r(1489),
                    h = r(8381),
                    g = r(758),
                    y = (0, a.default)("WA-JS:message");
                t.sendFileMessage = async function(e, t, r) {
                    const n = (r = Object.assign(Object.assign(Object.assign({}, h.defaultSendMessageOptions), {
                            type: "auto-detect"
                        }), r)).createChat ? await (0, u.assertFindChat)(e) : (0, u.assertGetChat)(e),
                        o = await (0, l.convertToFile)(t, r.mimetype, r.filename),
                        i = o.name,
                        s = await f.OpaqueData.createFromData(o, o.type),
                        a = {};
                    let c;
                    "audio" === r.type ? a.isPtt = r.isPtt : "image" === r.type ? c = r.isViewOnce : "video" === r.type ? a.asGif = r.isGif : "document" === r.type ? a.asDocument = !0 : "sticker" === r.type && (a.asSticker = !0);
                    const d = f.MediaPrep.prepRawMedia(s, a);
                    let p = await (0, g.prepareRawMessage)(n, {
                        caption: r.caption || i,
                        filename: i,
                        footer: r.footer
                    }, r);
                    p = (0, g.prepareMessageButtons)(p, r), r.markIsRead && (y("marking chat is read before send file"), await (0, g.markIsRead)(n.id).catch((() => null))), y(`sending message (${r.type}) with id ${p.id}`);
                    const m = d.sendToChat(n, {
                            caption: r.caption,
                            footer: r.footer,
                            isViewOnce: c,
                            productMsgOptions: p
                        }),
                        b = await new Promise((e => {
                            n.msgs.on("add", (function t(r) {
                                r.id === p.id && (n.msgs.off("add", t), e(r))
                            }))
                        }));

                    function v(e, t) {
                        y(`message file ${b.id} is ${t}`)
                    }
                    if (y(`message file ${b.id} queued`), b.on("change:mediaData.mediaStage", v), m.finally((() => {
                            b.off("change:mediaData.mediaStage", v)
                        })), r.waitForAck) {
                        y(`waiting ack for ${b.id}`);
                        const e = await m;
                        y(`ack received for ${b.id} (ACK: ${b.ack}, SendResult: ${e})`)
                    }
                    return {
                        id: b.id.toString(),
                        ack: b.ack,
                        sendMsgResult: m
                    }
                }, d.onReady((() => {
                    (0, p.wrapModuleFunction)(m.generateVideoThumbsAndDuration, (async(e, ...t) => {
                        const [r] = t;
                        try {
                            return await e(...t)
                        } catch (e) {
                            if ("string" == typeof e.message && e.message.includes("MEDIA_ERR_SRC_NOT_SUPPORTED")) try {
                                const e = await r.file.arrayBuffer(),
                                    t = (0, c.getVideoInfoFromBuffer)(e);
                                return {
                                    duration: t.duration,
                                    thumbs: r.maxDimensions.map((e => function(e, t, r) {
                                        let n = null != t ? t : r,
                                            o = null != e ? e : r;
                                        n > o ? n > r && (o *= r / n, n = r) : o > r && (n *= r / o, o = r);
                                        const i = {
                                                width: Math.max(n, 1),
                                                height: Math.max(o, 1)
                                            },
                                            s = document.createElement("canvas"),
                                            a = s.getContext("2d");
                                        return s.width = i.width, s.height = i.height, a.fillStyle = "white", a.fillRect(0, 0, s.width, s.height), {
                                            url: s.toDataURL("image/jpeg"),
                                            width: i.width,
                                            height: i.height,
                                            fullWidth: e,
                                            fullHeight: t
                                        }
                                    }(t.width, t.height, e)))
                                }
                            } catch (e) {
                                console.error(e)
                            }
                            throw e
                        }
                    }))
                }))
            },
            8851: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendListMessage = void 0;
                const s = r(8910),
                    a = i(r(7046)),
                    u = r(8785),
                    c = r(1489),
                    l = r(8381),
                    d = r(758);
                t.sendListMessage = async function(e, t) {
                    const r = (t = Object.assign(Object.assign({}, l.defaultSendMessageOptions), t)).sections;
                    if (!Array.isArray(r)) throw new s.WPPError("invalid_list_type", "Sections must be an array");
                    if (0 === r.length || r.length > 10) throw new s.WPPError("invalid_list_size", "Sections options must have between 1 and 10 options");
                    const n = {
                        type: "list",
                        list: {
                            buttonText: t.buttonText,
                            description: t.description || " ",
                            title: t.title,
                            footerText: t.footer,
                            listType: 1,
                            sections: r
                        },
                        footer: t.footer
                    };
                    return await (0, d.sendRawMessage)(e, n, t)
                }, a.onInjected((() => {
                    (0, u.wrapModuleFunction)(c.typeAttributeFromProtobuf, ((e, ...t) => {
                        const [r] = t;
                        return r.listMessage ? "text" : e(...t)
                    }))
                }))
            },
            2814: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendLocationMessage = void 0;
                const n = r(8381),
                    o = r(758),
                    i = r(9872);
                t.sendLocationMessage = async function(e, t) {
                    const r = (t = Object.assign(Object.assign({}, n.defaultSendMessageOptions), t)).name && t.address ? `${t.name}\n${t.address}` : t.name || t.address || "";
                    let s = {
                        type: "location",
                        lat: t.lat,
                        lng: t.lng,
                        loc: r,
                        clientUrl: t.url
                    };
                    return s = (0, i.prepareMessageButtons)(s, t), await (0, o.sendRawMessage)(e, s, t)
                }
            },
            682: function(e, t, r) {
                "use strict";
                var n = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendRawMessage = void 0;
                const o = n(r(1227)),
                    i = r(3327),
                    s = r(1489),
                    a = r(8381),
                    u = r(758),
                    c = (0, o.default)("WA-JS:message");
                t.sendRawMessage = async function(e, t, r = {}) {
                    const n = (r = Object.assign(Object.assign({}, a.defaultSendMessageOptions), r)).createChat ? await (0, i.assertFindChat)(e) : (0, i.assertGetChat)(e);
                    t = await (0, u.prepareRawMessage)(n, t, r), r.markIsRead && (c("marking chat is read before send message"), await (0, u.markIsRead)(n.id).catch((() => null))), c(`sending message (${t.type}) with id ${t.id}`);
                    const o = await (0, s.addAndSendMsgToChat)(n, t);
                    c(`message ${t.id} queued`);
                    const l = await o[0];
                    if (r.waitForAck) {
                        c(`waiting ack for ${t.id}`);
                        const e = await o[1];
                        c(`ack received for ${t.id} (ACK: ${l.ack}, SendResult: ${e})`)
                    }
                    return {
                        id: l.id.toString(),
                        ack: l.ack,
                        sendMsgResult: o[1]
                    }
                }
            },
            3065: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendReactionToMessage = void 0;
                const n = r(1092),
                    o = r(1489),
                    i = r(8491);
                t.sendReactionToMessage = async function(e, t) {
                    e instanceof n.MsgModel || "string" == typeof e || "function" != typeof e.toString || (e = e.toString());
                    const r = e instanceof n.MsgModel ? e : await (0, i.getMessageById)(e.toString());
                    return t || (t = ""), {
                        sendMsgResult: await (0, o.sendReactionToMsg)(r, t)
                    }
                }
            },
            6627: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendTextMessage = void 0;
                const n = r(8381),
                    o = r(758);
                t.sendTextMessage = async function(e, t, r = {}) {
                    r = Object.assign(Object.assign({}, n.defaultSendMessageOptions), r);
                    let i = {
                        body: t,
                        type: "chat",
                        subtype: null,
                        urlText: null,
                        urlNumber: null
                    };
                    return i = (0, o.prepareMessageButtons)(i, r), i = await (0, o.prepareLinkPreview)(i, r), await (0, o.sendRawMessage)(e, i, r)
                }
            },
            6017: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendVCardContactMessage = void 0;
                const n = r(3327),
                    o = r(1092),
                    i = r(8381),
                    s = r(758);
                t.sendVCardContactMessage = async function(e, t, r = {}) {
                    r = Object.assign(Object.assign({}, i.defaultSendMessageOptions), r), Array.isArray(t) || (t = [t]);
                    const a = [];
                    for (const e of t) {
                        let t = "",
                            r = "";
                        "object" == typeof e && "name" in e ? (t = e.id.toString(), r = e.name) : t = e.toString();
                        let i = o.ContactStore.get(t);
                        i || (i = new o.ContactModel({
                            id: (0, n.assertWid)(t),
                            name: r
                        })), !r && i.id.equals(o.UserPrefs.getMaybeMeUser()) && (r = i.displayName), r && (i = new o.ContactModel(i.attributes), i.name = r, Object.defineProperty(i, "formattedName", {
                            value: r
                        }), Object.defineProperty(i, "displayName", {
                            value: r
                        })), a.push(o.VCard.vcardFromContactModel(i))
                    }
                    const u = {};
                    return 1 === a.length ? (u.type = "vcard", u.body = a[0].vcard, u.vcardFormattedName = a[0].displayName) : (u.type = "multi_vcard", u.vcardList = a), (0, s.sendRawMessage)(e, u, r)
                }
            },
            7709: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.starMessage = void 0;
                const n = r(3327),
                    o = r(758);
                t.starMessage = async function(e, t = !0) {
                    let r = !1;
                    Array.isArray(e) || (r = !0, e = [e]);
                    const i = await (0, o.getMessageById)(e),
                        s = i.reduce(((e, t) => {
                            const r = t.id.remote.toString();
                            return e[r] = e[r] || [], e[r].push(t), e
                        }), {}),
                        a = i.map((e => ({
                            id: e.id.toString(),
                            star: e.star || !1
                        })));
                    for (const e in s) {
                        const r = (0, n.assertGetChat)(e),
                            o = s[e];
                        await r.sendStarMsgs(o, t)
                    }
                    return r ? a[0] : a
                }
            },
            8205: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.unmute = void 0;
                const n = r(3327);
                t.unmute = async function(e) {
                    const t = (0, n.assertWid)(e);
                    return (0, n.assertGetChat)(t).mute.unmute(!0)
                }
            },
            8381: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(1412), o(r(443), t), o(r(758), t), o(r(4296), t)
            },
            4296: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            },
            8913: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.config = t.defaultConfig = void 0, t.defaultConfig = {
                    deviceName: !1,
                    liveLocationLimit: 10
                }, t.config = t.defaultConfig;
                const r = window;
                r.WPPConfig = r.WPPConfig || t.defaultConfig;
                for (const e of Object.keys(r.WPPConfig)) t.config[e] = r.WPPConfig[e]
            },
            9371: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(8712), r(7150), r(3448), r(4078), r(8262), r(2958), r(7338)
            },
            8712: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092),
                    c = r(5005);
                a.onInjected((function() {
                    const e = async() => {
                        const e = await (0, c.getAuthCode)().catch((() => null));
                        s.internalEv.emit("conn.auth_code_change", e)
                    };
                    e(), u.Conn.on("change:ref", e)
                }))
            },
            7150: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092),
                    c = r(5005);
                a.onInjected((function() {
                    let e = (0, c.isAuthenticated)();
                    const t = async() => {
                        e || (s.internalEv.emit("conn.authenticated"), e = !1)
                    };
                    u.Cmd.isMainLoaded ? t() : u.Cmd.on("main_loaded", t), u.Cmd.on("logout", (() => {
                        e = !1
                    }))
                }))
            },
            3448: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092);
                a.onInjected((function() {
                    u.Cmd.on("logout", (() => s.internalEv.emit("conn.logout")))
                }))
            },
            4078: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092);
                a.onInjected((function() {
                    const e = async() => {
                        s.internalEv.emit("conn.main_loaded")
                    };
                    u.Cmd.isMainLoaded ? e() : u.Cmd.on("main_loaded", e)
                }))
            },
            8262: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092);
                a.onInjected((function() {
                    const e = async() => {
                        s.internalEv.emit("conn.main_ready")
                    };
                    "MAIN" === u.Stream.mode ? e() : u.Cmd.on("main_stream_mode_ready_legacy", e)
                }))
            },
            2958: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092),
                    c = r(5005);
                a.onInjected((function() {
                    const e = async() => {
                        (0, c.isIdle)() && s.internalEv.emit("conn.qrcode_idle")
                    };
                    e(), u.Socket.on("change:state", e)
                }))
            },
            7338: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092),
                    c = r(188),
                    l = r(5005);
                a.onInjected((function() {
                    let e = !1;
                    const t = async() => {
                        (0, l.isAuthenticated)() ? e = !1: e || u.Socket.state !== c.SOCKET_STATE.UNPAIRED && u.Socket.state !== c.SOCKET_STATE.UNPAIRED_IDLE || (e = !0, s.internalEv.emit("conn.require_auth"))
                    };
                    t(), u.Socket.on("change:state", t)
                }))
            },
            7834: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getAuthCode = void 0;
                const n = r(1092),
                    o = r(1489),
                    i = r(8803),
                    s = r(4819);
                t.getAuthCode = async function() {
                    if (!n.Conn.ref || n.Conn.connected || (0, s.isAuthenticated)()) return null;
                    const e = n.Conn.ref;
                    if ((0, s.isMultiDevice)()) {
                        const t = await i.waSignalStore.getRegistrationInfo(),
                            r = await i.waNoiseInfo.get(),
                            o = n.Base64.encodeB64(r.staticKeyPair.pubKey),
                            s = n.Base64.encodeB64(t.identityKeyPair.pubKey),
                            a = i.adv.getADVSecretKey(),
                            u = [e, o, s, a].join(",");
                        return {
                            type: "multidevice",
                            ref: e,
                            staticKeyPair: o,
                            identityKeyPair: s,
                            secretKey: a,
                            fullCode: u
                        }
                    }
                    const t = (0, o.getOrGenerate)(),
                        r = n.Browser.id(),
                        a = [e, t, r].join(",");
                    return {
                        type: "single",
                        ref: e,
                        keyPair: t,
                        browserId: r,
                        fullCode: a
                    }
                }
            },
            4819: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setMultiDevice = t.setKeepAlive = t.refreshQR = t.logout = t.isMultiDevice = t.isMainLoaded = t.isIdle = t.isAuthenticated = t.getAuthCode = void 0;
                var n = r(7834);
                Object.defineProperty(t, "getAuthCode", {
                    enumerable: !0,
                    get: function() {
                        return n.getAuthCode
                    }
                });
                var o = r(7064);
                Object.defineProperty(t, "isAuthenticated", {
                    enumerable: !0,
                    get: function() {
                        return o.isAuthenticated
                    }
                });
                var i = r(9466);
                Object.defineProperty(t, "isIdle", {
                    enumerable: !0,
                    get: function() {
                        return i.isIdle
                    }
                });
                var s = r(7009);
                Object.defineProperty(t, "isMainLoaded", {
                    enumerable: !0,
                    get: function() {
                        return s.isMainLoaded
                    }
                });
                var a = r(8552);
                Object.defineProperty(t, "isMultiDevice", {
                    enumerable: !0,
                    get: function() {
                        return a.isMultiDevice
                    }
                });
                var u = r(6115);
                Object.defineProperty(t, "logout", {
                    enumerable: !0,
                    get: function() {
                        return u.logout
                    }
                });
                var c = r(4735);
                Object.defineProperty(t, "refreshQR", {
                    enumerable: !0,
                    get: function() {
                        return c.refreshQR
                    }
                });
                var l = r(1054);
                Object.defineProperty(t, "setKeepAlive", {
                    enumerable: !0,
                    get: function() {
                        return l.setKeepAlive
                    }
                });
                var d = r(2421);
                Object.defineProperty(t, "setMultiDevice", {
                    enumerable: !0,
                    get: function() {
                        return d.setMultiDevice
                    }
                })
            },
            7064: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isAuthenticated = void 0;
                const s = i(r(1489));
                t.isAuthenticated = function() {
                    return s.isAuthenticated()
                }
            },
            9466: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isIdle = void 0;
                const n = r(1092),
                    o = r(188);
                t.isIdle = function() {
                    return n.Socket.state === o.SOCKET_STATE.UNPAIRED_IDLE
                }
            },
            7009: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isMainLoaded = void 0;
                const n = r(1092);
                t.isMainLoaded = function() {
                    return n.Cmd.isMainLoaded
                }
            },
            8552: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isMultiDevice = void 0;
                const n = r(1489);
                t.isMultiDevice = function() {
                    return (0, n.isMDBackend)()
                }
            },
            6115: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.logout = void 0;
                const n = r(1092);
                t.logout = async function() {
                    return n.Socket.logout(), await new Promise((e => {
                        n.Cmd.once("logout", e)
                    })), !0
                }
            },
            4735: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.refreshQR = void 0;
                const n = r(5267),
                    o = r(1092),
                    i = r(4819);
                t.refreshQR = async function() {
                    return (0, i.isAuthenticated)() ? null : ((0, i.isMultiDevice)() ? o.Cmd.refreshQR() : o.Socket.poke(), await n.internalEv.waitFor("conn.auth_code_change").then((e => e[0])))
                }
            },
            1054: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setKeepAlive = void 0;
                const r = document.hasFocus;
                let n;
                t.setKeepAlive = function(e = !0) {
                    return e ? (document.hasFocus = () => !0, n = setInterval((() => document.dispatchEvent(new Event("scroll"))), 15e3)) : (document.hasFocus = r, n && (clearInterval(n), n = null)), !!n
                }
            },
            2421: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setMultiDevice = void 0;
                const n = r(1092);
                t.setMultiDevice = function(e = !0) {
                    return e ? n.Cmd.upgradeToMDProd() : n.Cmd.downgradeWebclient(), !0
                }
            },
            5005: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(9371), o(r(4819), t), o(r(4963), t)
            },
            4963: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            },
            2102: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getProfilePictureUrl = void 0;
                const n = r(3327),
                    o = r(1092);
                t.getProfilePictureUrl = async function(e, t = !0) {
                    const r = (0, n.assertWid)(e),
                        i = await o.ProfilePicThumbStore.find(r);
                    if (i) return t ? i.imgFull : i.img
                }
            },
            7321: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getStatus = void 0;
                const n = r(3327),
                    o = r(1092);
                t.getStatus = async function(e) {
                    const t = (0, n.assertWid)(e);
                    return o.StatusStore.find(t)
                }
            },
            8713: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.queryExists = t.getStatus = t.getProfilePictureUrl = void 0;
                var n = r(2102);
                Object.defineProperty(t, "getProfilePictureUrl", {
                    enumerable: !0,
                    get: function() {
                        return n.getProfilePictureUrl
                    }
                });
                var o = r(7321);
                Object.defineProperty(t, "getStatus", {
                    enumerable: !0,
                    get: function() {
                        return o.getStatus
                    }
                });
                var i = r(1621);
                Object.defineProperty(t, "queryExists", {
                    enumerable: !0,
                    get: function() {
                        return i.queryExists
                    }
                })
            },
            1621: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.queryExists = void 0;
                const n = r(3327),
                    o = r(5005),
                    i = r(1092),
                    s = r(1489),
                    a = new Map;
                t.queryExists = async function(e) {
                    const t = (0, n.assertWid)(e),
                        r = t.toString();
                    if (a.has(r)) return a.get(r);
                    let u = null;
                    if (!(0, o.isMultiDevice)()) {
                        const e = await i.Wap.queryExist(r);
                        if (200 === e.status && (u = {
                                wid: e.jid,
                                biz: e.biz || !1
                            }, u)) {
                            const e = await i.Wap.queryDisappearingMode(t).catch((() => null));
                            200 === (null == e ? void 0 : e.status) && (u.disappearingMode = {
                                duration: e.duration,
                                settingTimestamp: e.settingTimestamp
                            })
                        }
                    }
                    return u || (u = await (0, s.sendQueryExists)(t).catch((() => null))), a.set(r, u), u
                }
            },
            6380: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(8713), t)
            },
            3905: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(8913),
                    a = i(r(7046));
                a.onInjected((() => {
                    if (!s.config.deviceName) return;
                    const e = a.search((e => e.default.info && e.default.hardRefresh));
                    if (e) {
                        const t = e.default.info();
                        t.os = s.config.deviceName, t.version = void 0, t.name = void 0, t.ua = void 0, e.default.info = () => t
                    }
                }))
            },
            5343: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(6387);
                t.EventEmitter = n.EventEmitter2
            },
            2923: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            },
            5267: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    },
                    i = this && this.__importDefault || function(e) {
                        return e && e.__esModule ? e : {
                            default: e
                        }
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.waitFor = t.stopListeningTo = t.setMaxListeners = t.removeListener = t.removeAllListeners = t.prependOnceListener = t.prependMany = t.prependListener = t.prependAny = t.once = t.onAny = t.on = t.offAny = t.off = t.many = t.listenersAny = t.listeners = t.listenerCount = t.listenTo = t.hasListeners = t.getMaxListeners = t.eventNames = t.emitAsync = t.emit = t.addListener = t.EventEmitter = t.ev = t.internalEv = void 0;
                const s = i(r(1227)),
                    a = r(5343);
                Object.defineProperty(t, "EventEmitter", {
                    enumerable: !0,
                    get: function() {
                        return a.EventEmitter
                    }
                }), o(r(2923), t);
                const u = (0, s.default)("WA-JS:event");
                t.internalEv = new a.EventEmitter({
                    maxListeners: 1 / 0
                }), t.ev = new a.EventEmitter({
                    maxListeners: 1 / 0
                }), t.internalEv.onAny(((e, ...r) => {
                    t.ev.emit(e, ...r), u.enabled && u(e, ...r)
                })), t.addListener = t.ev.addListener.bind(t.ev), t.emit = t.ev.emit.bind(t.ev), t.emitAsync = t.ev.emitAsync.bind(t.ev), t.eventNames = t.ev.eventNames.bind(t.ev), t.getMaxListeners = t.ev.getMaxListeners.bind(t.ev), t.hasListeners = t.ev.hasListeners.bind(t.ev), t.listenTo = t.ev.listenTo.bind(t.ev), t.listenerCount = t.ev.listenerCount.bind(t.ev), t.listeners = t.ev.listeners.bind(t.ev), t.listenersAny = t.ev.listenersAny.bind(t.ev), t.many = t.ev.many.bind(t.ev), t.off = t.ev.off.bind(t.ev), t.offAny = t.ev.offAny.bind(t.ev), t.on = t.ev.on.bind(t.ev), t.onAny = t.ev.onAny.bind(t.ev), t.once = t.ev.once.bind(t.ev), t.prependAny = t.ev.prependAny.bind(t.ev), t.prependListener = t.ev.prependListener.bind(t.ev), t.prependMany = t.ev.prependMany.bind(t.ev), t.prependOnceListener = t.ev.prependOnceListener.bind(t.ev), t.removeAllListeners = t.ev.removeAllListeners.bind(t.ev), t.removeListener = t.ev.removeListener.bind(t.ev), t.setMaxListeners = t.ev.setMaxListeners.bind(t.ev), t.stopListeningTo = t.ev.stopListeningTo.bind(t.ev), t.waitFor = t.ev.waitFor.bind(t.ev)
            },
            7172: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.addParticipants = void 0;
                const s = r(8910),
                    a = i(r(1489)),
                    u = r(2140);
                t.addParticipants = async function(e, t) {
                    const {
                        groupChat: r,
                        participants: n
                    } = await (0, u.ensureGroupAndParticipants)(e, t, !0);
                    if (n.some((e => {
                            var t;
                            return null === (t = r.groupMetadata) || void 0 === t ? void 0 : t.participants.get(e.id)
                        }))) throw new s.WPPError("group_participant_already_a_group_member", `Group ${r.id._serialized}: Group participant already a group member`);
                    return a.addParticipants(r, n)
                }
            },
            8392: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.canAdd = void 0;
                const n = r(4336);
                t.canAdd = async function(e) {
                    return (await (0, n.ensureGroup)(e)).groupMetadata.participants.canAdd()
                }
            },
            8245: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.canDemote = void 0;
                const n = r(4336);
                t.canDemote = async function(e, t) {
                    const {
                        groupChat: r,
                        participants: o
                    } = await (0, n.ensureGroupAndParticipants)(e, t);
                    return o.every((e => r.groupMetadata.participants.canDemote(e)))
                }
            },
            3574: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.canPromote = void 0;
                const n = r(4336);
                t.canPromote = async function(e, t) {
                    const {
                        groupChat: r,
                        participants: o
                    } = await (0, n.ensureGroupAndParticipants)(e, t);
                    return o.every((e => r.groupMetadata.participants.canPromote(e)))
                }
            },
            9927: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.canRemove = void 0;
                const n = r(4336);
                t.canRemove = async function(e, t) {
                    const {
                        groupChat: r,
                        participants: o
                    } = await (0, n.ensureGroupAndParticipants)(e, t);
                    return o.every((e => r.groupMetadata.participants.canRemove(e)))
                }
            },
            4210: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.create = void 0;
                const s = r(3327),
                    a = i(r(8381)),
                    u = i(r(6380)),
                    c = r(8910),
                    l = r(1092),
                    d = i(r(1489));
                t.create = async function(e, t) {
                    var r;
                    Array.isArray(t) || (t = [t]);
                    const n = t.map(s.assertWid),
                        o = [];
                    for (const e of n) {
                        const t = l.ContactStore.get(e);
                        if (t) {
                            o.push(t.id);
                            continue
                        }
                        const r = await u.queryExists(e);
                        if (!r) throw new c.WPPError("participant_not_exists", "Participant not exists", {
                            id: e
                        });
                        o.push(r.wid)
                    }
                    const i = await d.sendCreateGroup(e, o);
                    if (i.gid) {
                        const e = await a.find(i.gid);
                        !1 !== (null === (r = e.groupMetadata) || void 0 === r ? void 0 : r.stale) && await new Promise((t => {
                            e.on("change:groupMetadata.stale", (function r() {
                                var n;
                                !1 === (null === (n = e.groupMetadata) || void 0 === n ? void 0 : n.stale) && (t(), e.off("change:groupMetadata.stale", r))
                            }))
                        }))
                    }
                    return i
                }
            },
            426: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.demoteParticipants = void 0;
                const s = r(8910),
                    a = i(r(1489)),
                    u = r(2140);
                t.demoteParticipants = async function(e, t) {
                    const {
                        groupChat: r,
                        participants: n
                    } = await (0, u.ensureGroupAndParticipants)(e, t);
                    if (n.some((e => {
                            var t;
                            return !(null === (t = r.groupMetadata) || void 0 === t ? void 0 : t.participants.canDemote(e))
                        }))) throw new s.WPPError("group_participant_is_already_not_a_group_admin", `Group ${r.id._serialized}: Group participant is already not a group admin`);
                    return a.demoteParticipants(r, n)
                }
            },
            576: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.ensureGroup = void 0;
                const n = r(3327),
                    o = r(8910),
                    i = r(1092),
                    s = r(4336);
                t.ensureGroup = async function(e, t = !1) {
                    const r = (0, n.assertGetChat)(e);
                    if (!r.isGroup) throw new o.WPPError("not_a_group", `Chat ${r.id._serialized} is not a group`);
                    if (await i.GroupMetadataStore.find(r.id), t && !await (0, s.iAmAdmin)(e)) throw new o.WPPError("group_you_are_not_admin", `You are not admin in ${r.id._serialized}`);
                    return r
                }
            },
            2140: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.ensureGroupAndParticipants = void 0;
                const n = r(3327),
                    o = r(8910),
                    i = r(1092),
                    s = r(4336);
                t.ensureGroupAndParticipants = async function(e, t, r = !1) {
                    const a = await (0, s.ensureGroup)(e, !0);
                    Array.isArray(t) || (t = [t]);
                    const u = t.map(n.assertWid).map((e => {
                        var t;
                        let n = null === (t = a.groupMetadata) || void 0 === t ? void 0 : t.participants.get(e);
                        if (!n && r && (n = new i.ParticipantModel({
                                id: e
                            })), !n) throw new o.WPPError("group_participant_not_found", `Chat ${a.id._serialized} is not a group`);
                        return n
                    }));
                    return {
                        groupChat: a,
                        participants: u
                    }
                }
            },
            2106: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getGroupInfoFromInviteCode = void 0;
                const n = r(8910),
                    o = r(1489);
                t.getGroupInfoFromInviteCode = async function(e) {
                    var t, r, i;
                    e = (e = (e = (e = e.replace("chat.whatsapp.com/", "")).replace("invite/", "")).replace("https://", "")).replace("http://", "");
                    const s = await (0, o.sendQueryGroupInvite)(e).catch((() => null));
                    if (!s) throw new n.WPPError("invalid_invite_code", "Invalid Invite Code", {
                        inviteCode: e
                    });
                    return Object.assign(Object.assign({}, s), {
                        descOwner: null === (t = s.descOwner) || void 0 === t ? void 0 : t.toString(),
                        id: s.id.toString(),
                        owner: null === (r = s.owner) || void 0 === r ? void 0 : r.toString(),
                        participants: s.participants.map((e => Object.assign(Object.assign({}, e), {
                            id: e.id.toString()
                        }))),
                        subjectOwner: null === (i = s.subjectOwner) || void 0 === i ? void 0 : i.toString()
                    })
                }
            },
            5014: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getInviteCode = void 0;
                const n = r(7437),
                    o = r(4336);
                t.getInviteCode = async function(e) {
                    const t = await (0, o.ensureGroup)(e, !0);
                    return await (0, n.sendQueryGroupInviteCode)(t.id)
                }
            },
            2507: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getParticipants = void 0;
                const n = r(4336);
                t.getParticipants = async function(e) {
                    return (await (0, n.ensureGroup)(e)).groupMetadata.participants.models
                }
            },
            3376: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.iAmAdmin = void 0;
                const n = r(4336);
                t.iAmAdmin = async function(e) {
                    return (await (0, n.ensureGroup)(e)).groupMetadata.participants.iAmAdmin()
                }
            },
            4282: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.iAmMember = void 0;
                const n = r(4336);
                t.iAmMember = async function(e) {
                    return (await (0, n.ensureGroup)(e)).groupMetadata.participants.iAmMember()
                }
            },
            446: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.iAmRestrictedMember = void 0;
                const n = r(4336);
                t.iAmRestrictedMember = async function(e) {
                    return (await (0, n.ensureGroup)(e)).groupMetadata.participants.iAmRestrictedMember()
                }
            },
            5196: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.iAmSuperAdmin = void 0;
                const n = r(4336);
                t.iAmSuperAdmin = async function(e) {
                    return (await (0, n.ensureGroup)(e)).groupMetadata.participants.iAmMember()
                }
            },
            4336: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setSubject = t.setProperty = t.GroupProperty = t.setDescription = t.revokeInviteCode = t.removeParticipants = t.promoteParticipants = t.leave = t.join = t.iAmSuperAdmin = t.iAmRestrictedMember = t.iAmMember = t.iAmAdmin = t.getParticipants = t.getInviteCode = t.getGroupInfoFromInviteCode = t.ensureGroupAndParticipants = t.ensureGroup = t.demoteParticipants = t.create = t.canRemove = t.canPromote = t.canDemote = t.canAdd = t.addParticipants = void 0;
                var n = r(7172);
                Object.defineProperty(t, "addParticipants", {
                    enumerable: !0,
                    get: function() {
                        return n.addParticipants
                    }
                });
                var o = r(8392);
                Object.defineProperty(t, "canAdd", {
                    enumerable: !0,
                    get: function() {
                        return o.canAdd
                    }
                });
                var i = r(8245);
                Object.defineProperty(t, "canDemote", {
                    enumerable: !0,
                    get: function() {
                        return i.canDemote
                    }
                });
                var s = r(3574);
                Object.defineProperty(t, "canPromote", {
                    enumerable: !0,
                    get: function() {
                        return s.canPromote
                    }
                });
                var a = r(9927);
                Object.defineProperty(t, "canRemove", {
                    enumerable: !0,
                    get: function() {
                        return a.canRemove
                    }
                });
                var u = r(4210);
                Object.defineProperty(t, "create", {
                    enumerable: !0,
                    get: function() {
                        return u.create
                    }
                });
                var c = r(426);
                Object.defineProperty(t, "demoteParticipants", {
                    enumerable: !0,
                    get: function() {
                        return c.demoteParticipants
                    }
                });
                var l = r(576);
                Object.defineProperty(t, "ensureGroup", {
                    enumerable: !0,
                    get: function() {
                        return l.ensureGroup
                    }
                });
                var d = r(2140);
                Object.defineProperty(t, "ensureGroupAndParticipants", {
                    enumerable: !0,
                    get: function() {
                        return d.ensureGroupAndParticipants
                    }
                });
                var f = r(2106);
                Object.defineProperty(t, "getGroupInfoFromInviteCode", {
                    enumerable: !0,
                    get: function() {
                        return f.getGroupInfoFromInviteCode
                    }
                });
                var p = r(5014);
                Object.defineProperty(t, "getInviteCode", {
                    enumerable: !0,
                    get: function() {
                        return p.getInviteCode
                    }
                });
                var m = r(2507);
                Object.defineProperty(t, "getParticipants", {
                    enumerable: !0,
                    get: function() {
                        return m.getParticipants
                    }
                });
                var h = r(3376);
                Object.defineProperty(t, "iAmAdmin", {
                    enumerable: !0,
                    get: function() {
                        return h.iAmAdmin
                    }
                });
                var g = r(4282);
                Object.defineProperty(t, "iAmMember", {
                    enumerable: !0,
                    get: function() {
                        return g.iAmMember
                    }
                });
                var y = r(446);
                Object.defineProperty(t, "iAmRestrictedMember", {
                    enumerable: !0,
                    get: function() {
                        return y.iAmRestrictedMember
                    }
                });
                var b = r(5196);
                Object.defineProperty(t, "iAmSuperAdmin", {
                    enumerable: !0,
                    get: function() {
                        return b.iAmSuperAdmin
                    }
                });
                var v = r(3637);
                Object.defineProperty(t, "join", {
                    enumerable: !0,
                    get: function() {
                        return v.join
                    }
                });
                var _ = r(8037);
                Object.defineProperty(t, "leave", {
                    enumerable: !0,
                    get: function() {
                        return _.leave
                    }
                });
                var M = r(729);
                Object.defineProperty(t, "promoteParticipants", {
                    enumerable: !0,
                    get: function() {
                        return M.promoteParticipants
                    }
                });
                var w = r(1277);
                Object.defineProperty(t, "removeParticipants", {
                    enumerable: !0,
                    get: function() {
                        return w.removeParticipants
                    }
                });
                var P = r(270);
                Object.defineProperty(t, "revokeInviteCode", {
                    enumerable: !0,
                    get: function() {
                        return P.revokeInviteCode
                    }
                });
                var O = r(8087);
                Object.defineProperty(t, "setDescription", {
                    enumerable: !0,
                    get: function() {
                        return O.setDescription
                    }
                });
                var j = r(9380);
                Object.defineProperty(t, "GroupProperty", {
                    enumerable: !0,
                    get: function() {
                        return j.GroupProperty
                    }
                }), Object.defineProperty(t, "setProperty", {
                    enumerable: !0,
                    get: function() {
                        return j.setProperty
                    }
                });
                var x = r(8945);
                Object.defineProperty(t, "setSubject", {
                    enumerable: !0,
                    get: function() {
                        return x.setSubject
                    }
                })
            },
            3637: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.join = void 0;
                const n = r(1489);
                t.join = async function(e) {
                    return e = (e = (e = (e = e.replace("chat.whatsapp.com/", "")).replace("invite/", "")).replace("https://", "")).replace("http://", ""), {
                        id: (await (0, n.sendJoinGroupViaInvite)(e)).toString()
                    }
                }
            },
            8037: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.leave = void 0;
                const n = r(1489),
                    o = r(4336);
                t.leave = async function(e) {
                    const t = await (0, o.ensureGroup)(e);
                    return await (0, n.sendExitGroup)(t)
                }
            },
            729: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.promoteParticipants = void 0;
                const s = r(8910),
                    a = i(r(1489)),
                    u = r(2140);
                t.promoteParticipants = async function(e, t) {
                    const {
                        groupChat: r,
                        participants: n
                    } = await (0, u.ensureGroupAndParticipants)(e, t);
                    if (n.some((e => {
                            var t;
                            return !(null === (t = r.groupMetadata) || void 0 === t ? void 0 : t.participants.canPromote(e))
                        }))) throw new s.WPPError("group_participant_is_already_a_group_admin", `Group ${r.id._serialized}: Group participant is already a group admin`);
                    return a.promoteParticipants(r, n)
                }
            },
            1277: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.removeParticipants = void 0;
                const s = r(8910),
                    a = i(r(1489)),
                    u = r(2140);
                t.removeParticipants = async function(e, t) {
                    const {
                        groupChat: r,
                        participants: n
                    } = await (0, u.ensureGroupAndParticipants)(e, t);
                    if (n.some((e => {
                            var t;
                            return !(null === (t = r.groupMetadata) || void 0 === t ? void 0 : t.participants.canRemove(e))
                        }))) throw new s.WPPError("group_participant_is_not_a_group_member", `Group ${r.id._serialized}: Group participant is not a group member`);
                    return a.removeParticipants(r, n)
                }
            },
            270: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.revokeInviteCode = void 0;
                const n = r(1489),
                    o = r(4336);
                t.revokeInviteCode = async function(e) {
                    const t = await (0, o.ensureGroup)(e, !0);
                    return await (0, n.sendRevokeGroupInviteCode)(t.id)
                }
            },
            8087: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setDescription = void 0;
                const n = r(8910),
                    o = r(1489),
                    i = r(4336);
                t.setDescription = async function(e, t) {
                    var r, s;
                    const a = await (0, i.ensureGroup)(e);
                    if (!(null === (r = a.groupMetadata) || void 0 === r ? void 0 : r.canSetDescription())) throw new n.WPPError("you_are_not_allowed_set_group_description", `You are not allowed to set group description in ${a.id._serialized}`, {
                        groupId: a.id.toString()
                    });
                    const u = (0, o.randomMessageId)();
                    return await (0, o.sendSetGroupDescription)(a.id, t, u, null === (s = a.groupMetadata) || void 0 === s ? void 0 : s.descId), a.groupMetadata.descId = u, a.groupMetadata.desc = t, !0
                }
            },
            9380: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setProperty = t.GroupProperty = void 0;
                const n = r(8910),
                    o = r(1489),
                    i = r(4336);
                var s;
                ! function(e) {
                    e.ANNOUNCEMENT = "announcement", e.EPHEMERAL = "ephemeral", e.RESTRICT = "restrict"
                }(s = t.GroupProperty || (t.GroupProperty = {})), t.setProperty = async function(e, t, r) {
                    var a, u;
                    const c = await (0, i.ensureGroup)(e);
                    if (t !== s.ANNOUNCEMENT && !(null === (a = c.groupMetadata) || void 0 === a ? void 0 : a.canSetGroupProperty())) throw new n.WPPError("you_are_not_allowed_set_group_property", `You are not allowed to set property in ${c.id._serialized}`, {
                        groupId: c.id.toString()
                    });
                    if (t == s.ANNOUNCEMENT && !(null === (u = c.groupMetadata) || void 0 === u ? void 0 : u.canSetEphemeralSetting())) throw new n.WPPError("you_are_not_allowed_set_ephemeral_setting", `You are not allowed to set ephemeral setting in ${c.id._serialized}`, {
                        groupId: c.id.toString()
                    });
                    if (t === s.EPHEMERAL) {
                        if ("boolean" != typeof r && 1 !== r || (r = 604800), [0, 86400, 604800, 7776e3].includes(r)) throw new n.WPPError("invalid_ephemeral_duration", "Invalid ephemeral duration", {
                            value: r
                        })
                    } else r = r ? 1 : 0;
                    return await (0, o.sendSetGroupProperty)(c.id, t, r), !0
                }
            },
            8945: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setSubject = void 0;
                const n = r(8910),
                    o = r(1489),
                    i = r(4336);
                t.setSubject = async function(e, t) {
                    var r;
                    const s = await (0, i.ensureGroup)(e);
                    if (!(null === (r = s.groupMetadata) || void 0 === r ? void 0 : r.canSetSubject())) throw new n.WPPError("you_are_not_allowed_set_group_subject", `You are not allowed to set group subject in ${s.id._serialized}`, {
                        groupId: s.id.toString()
                    });
                    return await (0, o.sendSetGroupSubject)(s.id, t), s.name = t, s.formattedTitle = t, !0
                }
            },
            9474: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(4336), t)
            },
            3607: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.license = t.supportedWhatsappWeb = t.version = t.waitFor = t.stopListeningTo = t.setMaxListeners = t.removeListener = t.removeAllListeners = t.prependOnceListener = t.prependMany = t.prependListener = t.prependAny = t.once = t.onAny = t.on = t.offAny = t.off = t.many = t.listenersAny = t.listeners = t.listenerCount = t.listenTo = t.hasListeners = t.getMaxListeners = t.eventNames = t.emitAsync = t.emit = t.whatsapp = t.util = t.status = t.profile = t.labels = t.group = t.ev = t.contact = t.conn = t.chat = t.blocklist = t.config = t.isReady = t.isInjected = t.webpack = void 0, r(8913), r(3905);
                const s = i(r(7046));
                t.webpack = s;
                var a = r(7046);
                Object.defineProperty(t, "isInjected", {
                    enumerable: !0,
                    get: function() {
                        return a.isInjected
                    }
                }), Object.defineProperty(t, "isReady", {
                    enumerable: !0,
                    get: function() {
                        return a.isReady
                    }
                }), t.config = i(r(8913)), t.blocklist = i(r(5140)), t.chat = i(r(8381)), t.conn = i(r(5005)), t.contact = i(r(6380)), t.ev = i(r(5267)), t.group = i(r(9474)), t.labels = i(r(3606)), t.profile = i(r(6523)), t.status = i(r(9881)), t.util = i(r(8910)), t.whatsapp = i(r(1092));
                var u = r(5267);
                Object.defineProperty(t, "emit", {
                    enumerable: !0,
                    get: function() {
                        return u.emit
                    }
                }), Object.defineProperty(t, "emitAsync", {
                    enumerable: !0,
                    get: function() {
                        return u.emitAsync
                    }
                }), Object.defineProperty(t, "eventNames", {
                    enumerable: !0,
                    get: function() {
                        return u.eventNames
                    }
                }), Object.defineProperty(t, "getMaxListeners", {
                    enumerable: !0,
                    get: function() {
                        return u.getMaxListeners
                    }
                }), Object.defineProperty(t, "hasListeners", {
                    enumerable: !0,
                    get: function() {
                        return u.hasListeners
                    }
                }), Object.defineProperty(t, "listenTo", {
                    enumerable: !0,
                    get: function() {
                        return u.listenTo
                    }
                }), Object.defineProperty(t, "listenerCount", {
                    enumerable: !0,
                    get: function() {
                        return u.listenerCount
                    }
                }), Object.defineProperty(t, "listeners", {
                    enumerable: !0,
                    get: function() {
                        return u.listeners
                    }
                }), Object.defineProperty(t, "listenersAny", {
                    enumerable: !0,
                    get: function() {
                        return u.listenersAny
                    }
                }), Object.defineProperty(t, "many", {
                    enumerable: !0,
                    get: function() {
                        return u.many
                    }
                }), Object.defineProperty(t, "off", {
                    enumerable: !0,
                    get: function() {
                        return u.off
                    }
                }), Object.defineProperty(t, "offAny", {
                    enumerable: !0,
                    get: function() {
                        return u.offAny
                    }
                }), Object.defineProperty(t, "on", {
                    enumerable: !0,
                    get: function() {
                        return u.on
                    }
                }), Object.defineProperty(t, "onAny", {
                    enumerable: !0,
                    get: function() {
                        return u.onAny
                    }
                }), Object.defineProperty(t, "once", {
                    enumerable: !0,
                    get: function() {
                        return u.once
                    }
                }), Object.defineProperty(t, "prependAny", {
                    enumerable: !0,
                    get: function() {
                        return u.prependAny
                    }
                }), Object.defineProperty(t, "prependListener", {
                    enumerable: !0,
                    get: function() {
                        return u.prependListener
                    }
                }), Object.defineProperty(t, "prependMany", {
                    enumerable: !0,
                    get: function() {
                        return u.prependMany
                    }
                }), Object.defineProperty(t, "prependOnceListener", {
                    enumerable: !0,
                    get: function() {
                        return u.prependOnceListener
                    }
                }), Object.defineProperty(t, "removeAllListeners", {
                    enumerable: !0,
                    get: function() {
                        return u.removeAllListeners
                    }
                }), Object.defineProperty(t, "removeListener", {
                    enumerable: !0,
                    get: function() {
                        return u.removeListener
                    }
                }), Object.defineProperty(t, "setMaxListeners", {
                    enumerable: !0,
                    get: function() {
                        return u.setMaxListeners
                    }
                }), Object.defineProperty(t, "stopListeningTo", {
                    enumerable: !0,
                    get: function() {
                        return u.stopListeningTo
                    }
                }), Object.defineProperty(t, "waitFor", {
                    enumerable: !0,
                    get: function() {
                        return u.waitFor
                    }
                }), t.version = "2.2.2", t.supportedWhatsappWeb = ">=2.2210.6-beta", t.license = "Apache-2.0", s.injectLoader()
            },
            9203: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.addNewLabel = void 0;
                const n = r(3327),
                    o = r(8910),
                    i = r(1092),
                    s = r(8833);
                t.addNewLabel = async function(e, t = {}) {
                    let r;
                    if ((0, n.assertIsBusiness)(), r = ["number", "string"].includes(typeof t.labelColor) ? (0, n.assertColor)(t.labelColor) : await (0, s.getNewLabelColor)(), !await (0, s.colorIsInLabelPalette)(r)) throw new o.WPPError("color_not_in_pallet", "Color not in pallet");
                    return await i.LabelStore.addNewLabel(e, r.toString())
                }
            },
            9224: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.addOrRemoveLabels = void 0;
                const n = r(3327),
                    o = r(1092);
                t.addOrRemoveLabels = async function(e, t) {
                    (0, n.assertIsBusiness)(), Array.isArray(e) || (e = [e]), Array.isArray(t) || (t = [t]);
                    const r = e.map((e => (0, n.assertGetChat)(e))),
                        i = t.map((e => ({
                            id: e.labelId,
                            type: e.type
                        })));
                    return await o.LabelStore.addOrRemoveLabels(i, r)
                }
            },
            5908: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.colorIsInLabelPalette = void 0;
                const n = r(3327),
                    o = r(8833);
                t.colorIsInLabelPalette = async function(e) {
                    (0, n.assertIsBusiness)();
                    const t = await (0, o.getLabelColorPalette)();
                    return t && t.includes((0, n.assertColor)(e))
                }
            },
            3913: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.deleteAllLabels = void 0;
                const n = r(3327),
                    o = r(8833);
                t.deleteAllLabels = async function() {
                    (0, n.assertIsBusiness)();
                    const e = await (0, o.getAllLabels)();
                    return (0, o.deleteLabel)(e.map((e => e.id)))
                }
            },
            6651: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.deleteLabel = void 0;
                const n = r(3327),
                    o = r(1092);
                t.deleteLabel = async function(e) {
                    (0, n.assertIsBusiness)();
                    let t = !1;
                    Array.isArray(e) || (t = !0, e = [e]);
                    const r = [];
                    for (const t of e) r.push({
                        id: t,
                        deleteLabelResult: await o.LabelStore.deleteLabel(t)
                    });
                    return t ? r[0] : r
                }
            },
            8107: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getAllLabels = void 0;
                const n = r(3327),
                    o = r(1092);
                t.getAllLabels = async function() {
                    return o.LabelStore.models.map((e => ({
                        id: e.id,
                        name: e.name,
                        color: (0, n.assertColor)(e.hexColor),
                        count: e.count || 0,
                        hexColor: e.hexColor
                    })))
                }
            },
            4991: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getLabelColorPalette = void 0;
                const n = r(3327),
                    o = r(8910),
                    i = r(1092);
                t.getLabelColorPalette = async function() {
                    (0, n.assertIsBusiness)();
                    const e = await i.LabelStore.getLabelColorPalette();
                    if (!e) throw new o.WPPError("canot_get_color_palette", "Can't get color palette");
                    return e.map((e => (0, n.assertColor)(Number(e))))
                }
            },
            9887: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getNewLabelColor = void 0;
                const n = r(3327),
                    o = r(8910),
                    i = r(1092);
                t.getNewLabelColor = async function() {
                    (0, n.assertIsBusiness)();
                    const e = await i.LabelStore.getNewLabelColor();
                    if (!e) throw new o.WPPError("cannot_get_color", "Can't get new label color");
                    return (0, n.assertColor)(Number(e))
                }
            },
            8833: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getNewLabelColor = t.getLabelColorPalette = t.getAllLabels = t.deleteLabel = t.deleteAllLabels = t.colorIsInLabelPalette = t.addOrRemoveLabels = t.addNewLabel = void 0;
                var n = r(9203);
                Object.defineProperty(t, "addNewLabel", {
                    enumerable: !0,
                    get: function() {
                        return n.addNewLabel
                    }
                });
                var o = r(9224);
                Object.defineProperty(t, "addOrRemoveLabels", {
                    enumerable: !0,
                    get: function() {
                        return o.addOrRemoveLabels
                    }
                });
                var i = r(5908);
                Object.defineProperty(t, "colorIsInLabelPalette", {
                    enumerable: !0,
                    get: function() {
                        return i.colorIsInLabelPalette
                    }
                });
                var s = r(3913);
                Object.defineProperty(t, "deleteAllLabels", {
                    enumerable: !0,
                    get: function() {
                        return s.deleteAllLabels
                    }
                });
                var a = r(6651);
                Object.defineProperty(t, "deleteLabel", {
                    enumerable: !0,
                    get: function() {
                        return a.deleteLabel
                    }
                });
                var u = r(8107);
                Object.defineProperty(t, "getAllLabels", {
                    enumerable: !0,
                    get: function() {
                        return u.getAllLabels
                    }
                });
                var c = r(4991);
                Object.defineProperty(t, "getLabelColorPalette", {
                    enumerable: !0,
                    get: function() {
                        return c.getLabelColorPalette
                    }
                });
                var l = r(9887);
                Object.defineProperty(t, "getNewLabelColor", {
                    enumerable: !0,
                    get: function() {
                        return l.getNewLabelColor
                    }
                })
            },
            3606: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(8833), t), o(r(6572), t)
            },
            6572: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            },
            9016: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getMyStatus = void 0;
                const n = r(1092);
                t.getMyStatus = async function() {
                    return (await n.StatusStore.find(n.UserPrefs.getMaybeMeUser())).status
                }
            },
            1454: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setMyStatus = t.getMyStatus = void 0;
                var n = r(9016);
                Object.defineProperty(t, "getMyStatus", {
                    enumerable: !0,
                    get: function() {
                        return n.getMyStatus
                    }
                });
                var o = r(5031);
                Object.defineProperty(t, "setMyStatus", {
                    enumerable: !0,
                    get: function() {
                        return o.setMyStatus
                    }
                })
            },
            5031: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.setMyStatus = void 0;
                const s = r(1092),
                    a = i(r(1489));
                t.setMyStatus = async function(e) {
                    await a.setMyStatus(e);
                    const t = await s.StatusStore.find(s.UserPrefs.getMaybeMeUser());
                    return t && (t.status = e), !0
                }
            },
            6523: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(1454), t)
            },
            295: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.defaultSendStatusOptions = void 0, t.defaultSendStatusOptions = {
                    waitForAck: !0
                }
            },
            1858: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(7110)
            },
            7110: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r(5267),
                    a = i(r(7046)),
                    u = r(1092);
                a.onInjected((() => {
                    u.StatusV3Store.on("sync", (() => {
                        s.internalEv.emit("status.sync")
                    }))
                }))
            },
            438: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.get = void 0;
                const n = r(3327),
                    o = r(1092);
                t.get = function(e) {
                    const t = (0, n.assertWid)(e);
                    return o.StatusV3Store.get(t)
                }
            },
            7089: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getMyStatus = void 0;
                const n = r(1092);
                t.getMyStatus = async function() {
                    let e = n.StatusV3Store.getMyStatus();
                    return e || (e = await n.StatusV3Store.find(n.UserPrefs.getMaybeMeUser())), e
                }
            },
            2218: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendTextStatus = t.sendRawStatus = t.getMyStatus = t.get = void 0;
                var n = r(438);
                Object.defineProperty(t, "get", {
                    enumerable: !0,
                    get: function() {
                        return n.get
                    }
                });
                var o = r(7089);
                Object.defineProperty(t, "getMyStatus", {
                    enumerable: !0,
                    get: function() {
                        return o.getMyStatus
                    }
                });
                var i = r(1653);
                Object.defineProperty(t, "sendRawStatus", {
                    enumerable: !0,
                    get: function() {
                        return i.sendRawStatus
                    }
                });
                var s = r(6309);
                Object.defineProperty(t, "sendTextStatus", {
                    enumerable: !0,
                    get: function() {
                        return s.sendTextStatus
                    }
                })
            },
            1653: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendRawStatus = void 0;
                const s = i(r(8381)),
                    a = i(r(7046)),
                    u = r(1092),
                    c = r(8785),
                    l = r(1489),
                    d = r(9881);
                t.sendRawStatus = async function(e, t = {}) {
                    t = Object.assign(Object.assign({}, d.defaultSendStatusOptions), t);
                    const r = await s.sendRawMessage("status@broadcast", e, Object.assign(Object.assign({}, t), {
                        createChat: !0
                    }));
                    return r.sendMsgResult.then((() => {
                        u.ChatStore.resyncMessages()
                    })), r
                }, a.onInjected((() => {
                    (0, c.wrapModuleFunction)(l.createMsgProtobuf, ((e, ...t) => {
                        const [r] = t, n = e(...t);
                        return n.extendedTextMessage && ("number" == typeof r.backgroundColor && (n.extendedTextMessage.backgroundArgb = r.backgroundColor), "number" == typeof r.textColor && (n.extendedTextMessage.textArgb = r.textColor), "number" == typeof r.font && (n.extendedTextMessage.font = r.font)), n
                    }))
                }))
            },
            6309: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.sendTextStatus = void 0;
                const n = r(3327),
                    o = r(9881),
                    i = r(2218);
                t.sendTextStatus = async function(e, t = {}) {
                    let r, s;
                    t = Object.assign(Object.assign({}, o.defaultSendStatusOptions), t), ["number", "string"].includes(typeof t.backgroundColor) && (r = (0, n.assertColor)(t.backgroundColor)), ["number", "string"].includes(typeof t.textColor) && (s = (0, n.assertColor)(t.textColor));
                    const a = {
                        body: e,
                        type: "chat",
                        subtype: null,
                        urlText: null,
                        urlNumber: null,
                        ctwaContext: {},
                        font: t.font,
                        backgroundColor: r,
                        textColor: s
                    };
                    return await (0, i.sendRawStatus)(a, t)
                }
            },
            9881: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(1858), o(r(295), t), o(r(2218), t)
            },
            5118: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.blobToBase64 = void 0, t.blobToBase64 = function(e) {
                    return new Promise(((t, r) => {
                        const n = new FileReader;
                        n.onloadend = function() {
                            t(n.result)
                        }, n.onabort = r, n.onerror = r, n.readAsDataURL(e)
                    }))
                }
            },
            8930: function(e, t, r) {
                "use strict";
                var n = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.convertToFile = void 0;
                const o = n(r(7769)),
                    i = n(r(9932)),
                    s = r(8910);
                t.convertToFile = async function(e, t, r) {
                    let n = (0, i.default)(e);
                    if (!n && (0, s.isBase64)(e) && (n = (0, i.default)("data:;base64," + e)), !n) throw "invalid_data_url";
                    t || (t = n.contentType);
                    const a = n.toBuffer(),
                        u = new Blob([new Uint8Array(a, a.byteOffset, a.length)], {
                            type: t
                        });
                    if (!r || !t) {
                        const e = await o.default.fromBuffer(a);
                        if (e) {
                            const n = e.mime.split("/")[0];
                            r = r || `${n}.${e.ext}`, t = t || e.mime
                        }
                        r = r || "unknown", t = t || "application/octet-stream"
                    }
                    return new File([u], r, {
                        type: t,
                        lastModified: Date.now()
                    })
                }
            },
            3779: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.createWid = void 0;
                const n = r(1092);
                t.createWid = function(e) {
                    if (e) {
                        if (n.WidFactory.isWidlike(e)) return n.WidFactory.createWidFromWidLike(e);
                        if (e && "object" == typeof e && "object" == typeof e._serialized && (e = e._serialized), "string" == typeof e) return /^\d+$/.test(e) ? n.WidFactory.createUserWid(e, "c.us") : /^\d+-\d+$/.test(e) ? n.WidFactory.createUserWid(e, "g.us") : /status$/.test(e) ? n.WidFactory.createUserWid(e, "broadcast") : void 0
                    }
                }
            },
            6405: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.downloadImage = void 0, t.downloadImage = function(e, t = "image/jpeg", r = .85) {
                    return new Promise(((n, o) => {
                        const i = new Image;
                        i.crossOrigin = "anonymous", i.src = e, i.onerror = o, i.onload = () => {
                            const e = document.createElement("canvas"),
                                o = e.getContext("2d");
                            e.height = i.naturalHeight, e.width = i.naturalWidth, o.drawImage(i, 0, 0);
                            const s = e.toDataURL(t, r);
                            n({
                                data: s,
                                height: i.naturalHeight,
                                width: i.naturalWidth
                            })
                        }
                    }))
                }
            },
            542: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.WPPError = void 0;
                class r extends Error {
                    constructor(e, t, r = {}) {
                        if (super(t), this.code = e, r) {
                            const e = Object.keys(r);
                            for (const t of e) this[t] = r[t]
                        }
                    }
                }
                t.WPPError = r
            },
            3111: (e, t, r) => {
                "use strict";
                var n = r(8764).Buffer;
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.fetchDataFromPNG = void 0, t.fetchDataFromPNG = function(e) {
                    return new Promise(((t, r) => {
                        const o = new Image;
                        o.crossOrigin = "anonymous", o.src = e, o.onerror = r, o.onload = function() {
                            const e = document.createElement("canvas"),
                                r = e.getContext("2d");
                            e.height = o.naturalHeight, e.width = o.naturalWidth, r.drawImage(o, 0, 0);
                            const i = r.getImageData(0, 0, e.width, e.height).data,
                                s = n.from(i.filter(((e, t) => t % 4 < 3))),
                                a = (s[1] << 56) + (s[2] << 48) + (s[3] << 40) + (s[4] << 32) + (s[5] << 24) + (s[6] << 16) + (s[7] << 8) + s[8];
                            t(new Uint8Array(s.subarray(9, a + 9)))
                        }
                    }))
                }
            },
            3614: (e, t, r) => {
                "use strict";
                var n = r(8764).Buffer;
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getVideoInfoFromBuffer = void 0, t.getVideoInfoFromBuffer = function(e) {
                    const t = n.from(e),
                        r = n.from("mvhd"),
                        o = t.indexOf(r) + 17,
                        i = t.readUInt32BE(o),
                        s = t.readUInt32BE(o + 4),
                        a = t.indexOf(n.from("moov")),
                        u = t.indexOf(n.from("trak"), a + 4),
                        c = t.indexOf(n.from("stbl"), u + 4),
                        l = t.indexOf(n.from("avc1"), c + 4),
                        d = t.readUInt16BE(l + 4 + 24),
                        f = t.readUInt16BE(l + 4 + 26),
                        p = Math.floor(s / i * 1e3) / 1e3;
                    return {
                        duration: Math.floor(p),
                        width: d,
                        height: f
                    }
                }
            },
            8910: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(5118), t), o(r(8930), t), o(r(3779), t), o(r(6405), t), o(r(542), t), o(r(3111), t), o(r(3614), t), o(r(9531), t), o(r(2153), t), o(r(8878), t)
            },
            9531: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isBase64 = void 0;
                const r = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
                t.isBase64 = function(e) {
                    return r.test(e)
                }
            },
            6299: function(e, t, r) {
                "use strict";
                var n = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.generateThumbnailLinkPreviewData = t.fetchRemoteLinkPreviewData = void 0;
                const o = n(r(1227)),
                    i = r(1092),
                    s = r(1489),
                    a = r(6405),
                    u = r(3111),
                    c = (0, o.default)("WA-JS:link-preview"),
                    l = ["https://linkpreview.ddns.info", "https://linkpreview.eletroinfo.site", "https://linkpreview.hps.net.br", "https://wajsapi.titanwhats.com.br", "https://wppc-linkpreview.cloudtrix.com.br", "https://wppserver.comunicabh.com.br"],
                    d = 140;
                ! function(e) {
                    for (let t = e.length - 1; t > 0; t--) {
                        const r = Math.floor(Math.random() * (t + 1));
                        [e[t], e[r]] = [e[r], e[t]]
                    }
                }(l), t.fetchRemoteLinkPreviewData = async function(e) {
                    const t = new TextDecoder;
                    for (; l.length > 0;) {
                        const r = l[0];
                        c(`Fetching link preview using ${r}`, e);
                        const n = `${r}/v1/link-preview/fetch-data.png?url=` + encodeURI(e),
                            o = await (0, u.fetchDataFromPNG)(n).then((e => t.decode(e))).then((e => JSON.parse(e))).catch((() => null));
                        if (null === o || !("title" in o) && !("status" in o)) {
                            c(`The server ${r} is unavailable for link preview`), l.shift();
                            continue
                        }
                        if (!o.title && 200 !== o.status) return null;
                        const i = /^video/.test(o.mediaType);
                        return {
                            title: o.title,
                            description: o.description,
                            canonicalUrl: o.url,
                            matchedText: e,
                            richPreviewType: i ? 1 : 0,
                            doNotPlayInline: !i,
                            imageUrl: o.image
                        }
                    }
                    return null
                }, t.generateThumbnailLinkPreviewData = async function(e) {
                    if (!l[0]) return null;
                    const t = l[0];
                    c(`Downloading the preview image using ${t}`, e);
                    const r = `${t}/v1/link-preview/download-image?url=` + encodeURI(e),
                        n = await (0, a.downloadImage)(r).catch((() => null));
                    if (!n) return null;
                    if (n.width < d || n.height < 100) return null;
                    const o = await
                    function(e) {
                        return new Promise(((t, r) => {
                            const n = new Image;
                            n.crossOrigin = "anonymous", n.src = e, n.onerror = r, n.onload = () => {
                                try {
                                    const e = document.createElement("canvas"),
                                        r = e.getContext("2d");
                                    e.width = d, e.height = d;
                                    const o = Math.min(n.width, n.height),
                                        i = (n.width - o) / 2,
                                        s = (n.height - o) / 2;
                                    r.drawImage(n, i, s, o, o, 0, 0, d, d), t(e.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, ""))
                                } catch (e) {
                                    r()
                                }
                            }
                        }))
                    }(n.data);
                    if (n.width / n.height < 1.4) return {
                        thumbnail: o
                    };
                    const u = n.data.replace("data:image/jpeg;base64,", ""),
                        f = await i.OpaqueData.createFromBase64Jpeg(u),
                        p = new Uint8Array(32),
                        m = (window.crypto.getRandomValues(p), {
                            key: i.Base64.encodeB64(p),
                            timestamp: i.Clock.globalUnixTime()
                        }),
                        h = new AbortController,
                        g = await (0, s.uploadThumbnail)({
                            thumbnail: f,
                            mediaType: "thumbnail-link",
                            mediaKeyInfo: m,
                            uploadOrigin: 1,
                            forwardedFromWeb: !1,
                            signal: h.signal,
                            timeout: 3e3,
                            isViewOnce: !1
                        }),
                        y = g.mediaEntry;
                    return {
                        thumbnail: o,
                        thumbnailHQ: u,
                        mediaKey: y.mediaKey,
                        mediaKeyTimestamp: y.mediaKeyTimestamp,
                        thumbnailDirectPath: y.directPath,
                        thumbnailSha256: g.filehash,
                        thumbnailEncSha256: y.encFilehash,
                        thumbnailWidth: n.width,
                        thumbnailHeight: n.height
                    }
                }
            },
            2153: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                })
            },
            8878: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.wrapFunction = void 0, t.wrapFunction = function(e, t) {
                    return (...r) => t(e, ...r)
                }
            },
            7046: function(e, t, r) {
                "use strict";
                var n = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.modules = t.search = t.searchId = t.isReactComponent = t.moduleSource = t.injectLoader = t.webpackRequire = t.onReady = t.onInjected = t.isReady = t.isInjected = void 0;
                const o = n(r(1227)),
                    i = r(5267),
                    s = (0, o.default)("WA-JS:webpack");
                t.isInjected = !1, t.isReady = !1, t.onInjected = function(e) {
                    i.internalEv.on("webpack.injected", e)
                }, t.onReady = function(e) {
                    i.internalEv.on("webpack.ready", e)
                }, t.injectLoader = function() {
                    if (t.isInjected) return;
                    const e = "webpackChunkwhatsapp_web_client",
                        r = window,
                        n = r[e] = r[e] || [],
                        o = Date.now();
                    n.push([
                        [o], {},
                        async e => {
                            t.webpackRequire = e, t.isInjected = !0, s("injected"), await i.internalEv.emitAsync("webpack.injected").catch((() => null));
                            const r = new Array(1e4).fill(1).map(((e, t) => e + t)).filter((e => {
                                const r = t.webpackRequire.u(e);
                                return !r.includes("undefined") && (!r.includes("locales") || navigator.languages.some((e => r.includes(`locales/${e}`))))
                            }));
                            await Promise.all(r.reverse().map((e => t.webpackRequire.e(e)))), t.isReady = !0, s("ready to use"), await i.internalEv.emitAsync("webpack.ready").catch((() => null))
                        }
                    ])
                };
                const a = new Map;

                function u(e) {
                    if (void 0 === t.webpackRequire.m[e]) return "";
                    if (a.has(e)) return a.get(e);
                    const r = t.webpackRequire.m[e].toString();
                    return a.set(e, r), r
                }
                t.moduleSource = u;
                const c = new Map;

                function l(e) {
                    if (c.has(e)) return c.get(e);
                    const t = u(e),
                        r = /\w+\.(Pure)?Component\s*\{/.test(t);
                    return c.set(e, r), r
                }

                function d(e, r = !1) {
                    let n = Object.keys(t.webpackRequire.m);
                    r && (n = n.reverse());
                    const o = setTimeout((() => {
                        s(`Searching for: ${e.toString()}`)
                    }), 500);
                    for (const r of n)
                        if (!l(r)) try {
                            const n = (0, t.webpackRequire)(r);
                            if (e(n, r)) return s(`Module found: ${r} - ${e.toString()}`), clearTimeout(o), r
                        } catch (e) {
                            continue
                        }
                        return s(`Module not found: ${e.toString()}`), null
                }
                t.isReactComponent = l, t.searchId = d, t.search = function(e, r = !1) {
                    const n = d(e, r);
                    return n ? (0, t.webpackRequire)(n) : null
                }, t.modules = function(e, r = !1) {
                    const n = {};
                    let o = Object.keys(t.webpackRequire.m);
                    r && (o = o.reverse());
                    for (const r of o)
                        if (!l(r)) try {
                            const o = (0, t.webpackRequire)(r);
                            e && !e(o, r) || (n[r] = o)
                        } catch (e) {
                            continue
                        }
                        return s(`${Object.keys(n).length} modules found with: ${null==e?void 0:e.toString()}`), n
                }
            },
            6407: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    BaseCollection: "BaseCollection"
                }, (e => e.CACHE_POLICY || e.BaseCollection))
            },
            8793: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    BlocklistCollection: "BlocklistCollectionImpl"
                }, (e => e.BlocklistCollectionImpl))
            },
            8852: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    BusinessCategoriesResultCollection: "BusinessCategoriesResultCollectionImpl"
                }, (e => e.BusinessCategoriesResultCollectionImpl))
            },
            6705: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    BusinessProfileCollection: "BusinessProfileCollectionImpl"
                }, (e => e.BusinessProfileCollectionImpl))
            },
            5367: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(6407), (0, n.exportModule)(t, {
                    ButtonCollection: ["ButtonCollectionImpl", "ButtonCollection"]
                }, (e => e.ButtonCollectionImpl || e.ButtonCollection))
            },
            9357: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    CallCollection: "CallCollectionImpl"
                }, (e => e.CallCollectionImpl))
            },
            264: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    CartCollection: "CartCollectionImpl"
                }, (e => e.CartCollectionImpl))
            },
            2297: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    CartItemCollection: ["CartItemCollectionImpl", "CartItemCollection"]
                }, (e => e.CartItemCollectionImpl || e.CartItemCollection))
            },
            5667: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    CatalogCollection: "CatalogCollectionImpl"
                }, (e => e.CatalogCollectionImpl || e.CatalogCollection))
            },
            1807: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(6407), (0, n.exportModule)(t, {
                    ChatCollection: "ChatCollectionImpl"
                }, (e => e.ChatCollectionImpl))
            },
            9950: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    ChatstateCollection: ["ChatstateCollectionImpl", "ChatstateCollection"]
                }, (e => e.ChatstateCollectionImpl || e.ChatstateCollection))
            },
            2651: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(3073), (0, n.exportModule)(t, {
                    Collection: "default"
                }, (e => e.default.toString().includes("Collection initialized without model")))
            },
            220: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    ContactCollection: "ContactCollectionImpl"
                }, (e => e.ContactCollectionImpl))
            },
            4850: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    EmojiVariantCollection: "EmojiVariantCollectionImpl"
                }, (e => e.EmojiVariantCollectionImpl))
            },
            3875: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7590), (0, n.exportModule)(t, {
                    GroupMetadataCollection: "default.constructor"
                }, (e => "function" == typeof e.default.handlePendingInvite))
            },
            4797: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(6407), (0, n.exportModule)(t, {
                    LabelCollection: "LabelCollectionImpl"
                }, (e => e.LabelCollectionImpl))
            },
            8608: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    LabelItemCollection: ["LabelItemCollectionImpl", "LabelItemCollection"]
                }, (e => e.LabelItemCollectionImpl || e.LabelItemCollection))
            },
            5547: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7590), (0, n.exportModule)(t, {
                    LiveLocationCollection: "LiveLocationCollectionImpl"
                }, (e => e.LiveLocationCollectionImpl))
            },
            5741: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(6407), (0, n.exportModule)(t, {
                    MsgCollection: "MsgCollectionImpl"
                }, (e => e.MsgCollectionImpl))
            },
            8146: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    MsgInfoCollection: "MsgInfoCollectionImpl"
                }, (e => e.MsgInfoCollectionImpl))
            },
            8141: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    MuteCollection: "MuteCollectionImpl"
                }, (e => e.MuteCollectionImpl))
            },
            7210: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    OrderCollection: "OrderCollectionImpl"
                }, (e => e.OrderCollectionImpl))
            },
            3672: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    OrderItemCollection: ["OrderItemCollectionImpl", "OrderItemCollection"]
                }, (e => e.OrderItemCollectionImpl || e.OrderItemCollection))
            },
            6850: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    ParticipantCollection: ["ParticipantCollectionImpl", "ParticipantCollection"]
                }, (e => e.ParticipantCollectionImpl || e.ParticipantCollection))
            },
            5399: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(6407), (0, n.exportModule)(t, {
                    PresenceCollection: "PresenceCollectionImpl"
                }, (e => e.PresenceCollectionImpl || e.PresenceCollection))
            },
            7932: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    ProductCollCollection: ["ProductCollCollectionImpl", "ProductCollCollection"]
                }, (e => e.ProductCollCollectionImpl || e.ProductCollCollection))
            },
            3321: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    ProductCollection: ["ProductCollectionImpl", "ProductCollection"]
                }, (e => e.ProductCollectionImpl || e.ProductCollection))
            },
            6215: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    ProductImageCollection: ["ProductImageCollectionImpl", "ProductImageCollection"]
                }, (e => e.ProductImageCollectionImpl || e.ProductImageCollection))
            },
            128: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    ProductMessageListCollection: "ProductMessageListCollectionImpl"
                }, (e => e.ProductMessageListCollectionImpl))
            },
            5381: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(6407), (0, n.exportModule)(t, {
                    ProfilePicThumbCollection: "ProfilePicThumbCollectionImpl"
                }, (e => e.ProfilePicThumbCollectionImpl))
            },
            6932: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    QuickReplyCollection: "QuickReplyCollectionImpl"
                }, (e => e.QuickReplyCollectionImpl))
            },
            5059: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    RecentEmojiCollection: "RecentEmojiCollectionImpl"
                }, (e => e.RecentEmojiCollectionImpl))
            },
            1673: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    RecentStickerCollection: "RecentStickerCollectionImpl"
                }, (e => e.RecentStickerCollectionImpl))
            },
            8979: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    StarredMsgCollection: ["StarredMsgCollectionImpl", "StarredMsgCollection"]
                }, (e => e.StarredMsgCollectionImpl || e.StarredMsgCollection))
            },
            400: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    StarredStickerCollection: "StarredStickerCollectionImpl"
                }, (e => e.StarredStickerCollectionImpl))
            },
            4596: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7590), (0, n.exportModule)(t, {
                    StatusCollection: "StatusCollectionImpl"
                }, (e => e.StatusCollectionImpl))
            },
            4231: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7590), (0, n.exportModule)(t, {
                    StatusV3Collection: "StatusV3CollectionImpl"
                }, (e => e.StatusV3CollectionImpl || e.StatusV3Collection))
            },
            1529: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    StickerCollection: "StickerCollectionImpl"
                }, (e => e.StickerCollectionImpl || e.StickerCollection))
            },
            337: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    StickerPackCollection: "StickerPackCollectionImpl"
                }, (e => e.StickerPackCollectionImpl))
            },
            8420: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    StickerSearchCollection: "StickerSearchCollectionImpl"
                }, (e => e.StickerSearchCollectionImpl))
            },
            3747: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(2651), (0, n.exportModule)(t, {
                    TemplateButtonCollection: "TemplateButtonCollection"
                }, (e => e.TemplateButtonCollectionImpl || e.TemplateButtonCollection))
            },
            7590: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(6407), t), o(r(8793), t), o(r(8852), t), o(r(6705), t), o(r(5367), t), o(r(9357), t), o(r(264), t), o(r(2297), t), o(r(5667), t), o(r(1807), t), o(r(9950), t), o(r(2651), t), o(r(220), t), o(r(220), t), o(r(220), t), o(r(4850), t), o(r(3875), t), o(r(4797), t), o(r(8608), t), o(r(5547), t), o(r(5741), t), o(r(8146), t), o(r(8141), t), o(r(7210), t), o(r(3672), t), o(r(6850), t), o(r(5399), t), o(r(7932), t), o(r(3321), t), o(r(6215), t), o(r(128), t), o(r(5381), t), o(r(6932), t), o(r(5059), t), o(r(1673), t), o(r(8979), t), o(r(400), t), o(r(4596), t), o(r(4231), t), o(r(1529), t), o(r(337), t), o(r(8420), t), o(r(3747), t)
            },
            6668: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    ACK: ["ACK", "default.ACK"],
                    EDIT_ATTR: ["EDIT_ATTR", "default.EDIT_ATTR"],
                    ACK_STRING: ["ACK_STRING", "default.ACK_STRING"]
                }, (e => e.ACK || e.default.ACK))
            },
            8547: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    GROUP_SETTING_TYPE: ["GROUP_SETTING_TYPE", "default.GROUP_SETTING_TYPE"]
                }, (e => e.GROUP_SETTING_TYPE || e.default.GROUP_SETTING_TYPE))
            },
            5911: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    LogoutReason: "LogoutReason"
                }, (e => e.LogoutReason))
            },
            2213: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    MSG_TYPE: ["MSG_TYPE", "default.MSG_TYPE"],
                    SYSTEM_MESSAGE_TYPES: ["SYSTEM_MESSAGE_TYPES", "default.SYSTEM_MESSAGE_TYPES"]
                }, (e => e.MSG_TYPE || e.default.MSG_TYPE))
            },
            7376: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    OUTWARD_TYPES: "OUTWARD_TYPES"
                }, (e => e.OUTWARD_TYPES))
            },
            188: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    SOCKET_STATE: ["SOCKET_STATE", "default.SOCKET_STATE"],
                    SOCKET_STREAM: ["SOCKET_STREAM", "default.SOCKET_STREAM"],
                    WATCHED_SOCKET_STATE: ["WATCHED_SOCKET_STATE", "default.WATCHED_SOCKET_STATE"]
                }, (e => e.SOCKET_STATE || e.default.SOCKET_STATE))
            },
            4150: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    SendMsgResult: "SendMsgResult"
                }, (e => e.SendMsgResult))
            },
            9428: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(6668), t), o(r(8547), t), o(r(5911), t), o(r(2213), t), o(r(7376), t), o(r(4150), t)
            },
            8785: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.wrapModuleFunction = t.exportProxyModel = t.exportModule = t._moduleIdMap = void 0;
                const s = r(8910),
                    a = i(r(7046)),
                    u = new WeakMap,
                    c = new WeakMap;

                function l(e, t, r) {
                    "string" == typeof t && (t = {
                        [t]: null
                    });
                    for (const n of Object.keys(t)) {
                        const o = t[n];
                        Object.defineProperty(e, n, {
                            enumerable: !0,
                            configurable: !0,
                            get() {
                                let e, t;
                                const i = a.searchId(r);
                                if (!i) throw `Module ${n} not found with ${r.toString()}`;
                                const s = a.webpackRequire(i);
                                if (Array.isArray(o)) {
                                    for (const r of o)
                                        if (e = () => r.split(".").reduce(((e, t) => null == e ? void 0 : e[t]), s), e()) {
                                            t = r;
                                            break
                                        }
                                    if (!e()) throw `Property ${o} not found in module ${n}`
                                } else if ("string" == typeof o) {
                                    if (e = () => o.split(".").reduce(((e, t) => null == e ? void 0 : e[t]), s), !e()) throw `Property ${o} not found in module ${n}`;
                                    t = o
                                } else e = () => s;
                                if (e) {
                                    Object.defineProperty(this, n, {
                                        get: e
                                    });
                                    try {
                                        const r = e();
                                        u.set(r, i), t && c.set(r, t)
                                    } catch (e) {}
                                    return e()
                                }
                            }
                        })
                    }
                }
                t._moduleIdMap = u, t.exportModule = l, t.exportProxyModel = function(e, t) {
                    const r = t.replace(/Model$/, ""),
                        n = [r];
                    n.push(r.replace(/^(\w)/, (e => e.toLowerCase())));
                    const o = r.split(/(?=[A-Z])/);
                    n.push(o.join("-").toLowerCase()), n.push(o.join("_").toLowerCase()), l(e, {
                        [t]: ["default", t, r]
                    }, (e => {
                        var o, i, s, a, u, c;
                        return n.includes((null === (i = null === (o = e.default) || void 0 === o ? void 0 : o.prototype) || void 0 === i ? void 0 : i.proxyName) || (null === (a = null === (s = e[t]) || void 0 === s ? void 0 : s.prototype) || void 0 === a ? void 0 : a.proxyName) || (null === (c = null === (u = e[r]) || void 0 === u ? void 0 : u.prototype) || void 0 === c ? void 0 : c.proxyName))
                    }))
                }, t.wrapModuleFunction = function(e, r) {
                    if ("function" != typeof e) throw new TypeError("func is not a function");
                    const n = t._moduleIdMap.get(e);
                    if (!n) throw new TypeError("func is not an exported function");
                    const o = a.webpackRequire(n),
                        i = c.get(e);
                    if (!i) throw new TypeError("function path not found");
                    const l = i.split("."),
                        d = l.pop();
                    if (!d) throw new TypeError(`function not found in the module ${n}`);
                    const f = l.reduce(((e, t) => null == e ? void 0 : e[t]), o);
                    f[d] = (0, s.wrapFunction)(e.bind(f), r), u.set(f[d], n), c.set(f[d], i)
                }
            },
            4467: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    addAndSendMsgToChat: "addAndSendMsgToChat"
                }, (e => e.addAndSendMsgToChat))
            },
            3968: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    blockContact: "blockContact",
                    unblockContact: "unblockContact"
                }, (e => e.blockContact && e.unblockContact))
            },
            1435: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    createMsgProtobuf: "createMsgProtobuf"
                }, (e => e.createMsgProtobuf))
            },
            9943: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = i(r(7046));
                (0, r(8785).exportModule)(t, {
                    fetchLinkPreview: "default"
                }, ((e, t) => {
                    const r = s.moduleSource(t);
                    return r.includes(".queryLinkPreview") && r.includes(".getProductOrCatalogLinkPreview")
                }))
            },
            8967: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    findChat: "findChat"
                }, (e => e.findChat))
            },
            3879: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    findFirstWebLink: "findFirstWebLink"
                }, (e => e.findFirstWebLink))
            },
            6187: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    genMinimalLinkPreview: "genMinimalLinkPreview"
                }, (e => e.genMinimalLinkPreview))
            },
            6552: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    generateVideoThumbsAndDuration: "generateVideoThumbsAndDuration"
                }, (e => e.generateVideoThumbsAndDuration))
            },
            5993: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    getOrGenerate: "getOrGenerate"
                }, (e => e.getOrGenerate))
            },
            2922: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    addParticipants: "addParticipants",
                    removeParticipants: "removeParticipants",
                    promoteParticipants: "promoteParticipants",
                    demoteParticipants: "demoteParticipants"
                }, (e => e.addParticipants && e.removeParticipants && e.promoteParticipants && e.demoteParticipants && !e.updateParticipants))
            },
            4005: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                // (0, n.exportModule)(t, {
                //     handleStatusSimpleAck: "handleStatusSimpleAck"
                // }, (e => e.handleStatusSimpleAck)), (0, n.exportModule)(t, {
                //     handleChatSimpleAck: "handleChatSimpleAck"
                // }, (e => e.handleChatSimpleAck)), (0, n.exportModule)(t, {
                //     handleGroupSimpleAck: "handleGroupSimpleAck"
                // }, (e => e.handleGroupSimpleAck))
            },
            1489: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(4467), t), o(r(3968), t), o(r(1435), t), o(r(9943), t), o(r(8967), t), o(r(3879), t), o(r(6552), t), o(r(6187), t), o(r(5993), t), o(r(2922), t), o(r(4005), t), o(r(2129), t), o(r(3295), t), o(r(9472), t), o(r(7212), t), o(r(9731), t), o(r(1486), t), o(r(5244), t), o(r(2907), t), o(r(7571), t), o(r(5863), t), o(r(5767), t), o(r(8879), t), o(r(2891), t), o(r(5221), t), o(r(5931), t), o(r(4526), t), o(r(3643), t), o(r(1232), t), o(r(9381), t), o(r(7358), t), o(r(8522), t), o(r(1426), t), o(r(267), t), o(r(981), t)
            },
            2129: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    isAuthenticated: ["isLoggedIn", "Z"],
                    isLoggedIn: ["isLoggedIn", "Z"]
                }, (e => {
                    var t, r;
                    return (null === (t = e.Z) || void 0 === t ? void 0 : t.toString().includes("isRegistered")) && (null === (r = e.Z) || void 0 === r ? void 0 : r.toString().includes("getLoginTokens")) || e.isLoggedIn
                }))
            },
            3295: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    isMDBackend: "isMDBackend",
                    isLegacyWebdBackend: "isLegacyWebdBackend"
                }, (e => e.isMDBackend))
            },
            9472: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                (0, n.exportModule)(t, {
                    markUnread: "markUnread",
                    sendSeen: "sendSeen"
                }, (e => e.markUnread && e.sendSeen)), (0, n.exportModule)(t, {
                    markPlayed: "markPlayed"
                }, (e => e.markPlayed))
            },
            7212: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    mediaTypeFromProtobuf: "mediaTypeFromProtobuf"
                }, (e => e.mediaTypeFromProtobuf))
            },
            9731: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    msgFindQuery: "msgFindQuery"
                }, (e => e.msgFindQuery && e.msgFindByIds))
            },
            1486: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    addProduct: "addProduct",
                    editProduct: "editProduct",
                    deleteProducts: "deleteProducts",
                    sendProductToChat: "sendProductToChat"
                }, (e => e.sendProductToChat))
            },
            5244: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendSetPicture: "sendSetPicture"
                }, (e => e.sendSetPicture && e.requestDeletePicture))
            },
            2907: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    randomMessageId: ["newTag", "default.newId", "default"]
                }, (e => e.randomId || e.default.toString().includes("MsgKey error: obj is null/undefined") && e.default.newId))
            },
            7571: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendCallSignalingMsg: "sendCallSignalingMsg"
                }, (e => e.sendCallSignalingMsg))
            },
            5863: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendClear: "sendClear"
                }, (e => e.sendClear && !e.clearStorage))
            },
            5767: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendCreateGroup: "sendCreateGroup"
                }, (e => e.sendCreateGroup))
            },
            8879: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendDelete: "sendDelete"
                }, (e => e.sendDelete))
            },
            2891: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendExitGroup: "sendExitGroup"
                }, (e => e.sendExitGroup && e.localExitGroup))
            },
            5221: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendJoinGroupViaInvite: "sendJoinGroupViaInvite"
                }, (e => e.sendJoinGroupViaInvite))
            },
            5931: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendQueryExists: ["queryExists", "default"]
                }, (e => {
                    var t, r;
                    return (null === (t = e.default) || void 0 === t ? void 0 : t.toString().includes("Should not reach queryExists MD")) || (null === (r = e.queryExists) || void 0 === r ? void 0 : r.toString().includes("Should not reach queryExists MD")) || e.queryExists && e.queryPhoneExists
                }))
            },
            4526: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendQueryGroupInvite: "sendQueryGroupInvite"
                }, (e => e.sendQueryGroupInvite))
            },
            7437: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendQueryGroupInviteCode: "sendQueryGroupInviteCode"
                }, (e => e.sendQueryGroupInviteCode))
            },
            3643: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendReactionToMsg: "sendReactionToMsg"
                }, (e => e.sendReactionToMsg))
            },
            1232: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendRevokeGroupInviteCode: "sendRevokeGroupInviteCode"
                }, (e => e.sendRevokeGroupInviteCode))
            },
            9381: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendTextMsgToChat: "sendTextMsgToChat"
                }, (e => e.sendTextMsgToChat))
            },
            7358: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    sendSetGroupSubject: "sendSetGroupSubject",
                    sendSetGroupDescription: "sendSetGroupDescription",
                    sendSetGroupProperty: "sendSetGroupProperty"
                }, (e => e.sendSetGroupSubject && e.sendSetGroupDescription && e.sendSetGroupProperty))
            },
            8522: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    getStatus: "getStatus",
                    setMyStatus: "setMyStatus"
                }, (e => e.getStatus && e.setMyStatus && e.queryStatusAll))
            },
            1426: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    typeAttributeFromProtobuf: "typeAttributeFromProtobuf"
                }, (e => e.typeAttributeFromProtobuf))
            },
            267: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    uploadProductImage: "uploadProductImage"
                }, (e => e.MediaPrep))
            },
            981: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = i(r(7046));
                (0, r(8785).exportModule)(t, {
                    uploadThumbnail: "default"
                }, ((e, t) => {
                    const r = s.moduleSource(t);
                    return r.includes("thumbnail") && r.includes(".cancelUploadMedia") && r.includes(".calculateFilehashFromBlob")
                }))
            },
            1092: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    },
                    s = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.multidevice = t.functions = t._moduleIdMap = t.enums = void 0, i(r(7590), t), t.enums = s(r(9428));
                var a = r(8785);
                Object.defineProperty(t, "_moduleIdMap", {
                    enumerable: !0,
                    get: function() {
                        return a._moduleIdMap
                    }
                }), t.functions = s(r(1489)), i(r(3073), t), i(r(7429), t), t.multidevice = s(r(8803)), i(r(5786), t)
            },
            2064: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "Base64", (e => e.encodeB64 && e.decodeB64))
            },
            7562: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    Browser: "default"
                }, (e => e.default.id && e.default.startDownloading))
            },
            8101: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "ChatPresence", (e => e.markComposing))
            },
            5847: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    ClockClass: "Clock.constructor",
                    Clock: "Clock"
                }, (e => {
                    var t;
                    return null === (t = e.Clock) || void 0 === t ? void 0 : t.globalUnixTime
                }))
            },
            6031: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(3073), (0, n.exportModule)(t, {
                    CmdClass: "CmdImpl",
                    Cmd: "Cmd"
                }, (e => e.Cmd && e.CmdImpl))
            },
            7563: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    Conn: "Conn"
                }, (e => e.Conn && e.ConnImpl))
            },
            7169: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    Constants: "default"
                }, (e => e.default.IMG_THUMB_MAX_EDGE))
            },
            1245: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    EventEmitter: "default"
                }, (e => e.default.toString().includes("Callback parameter passed is not a function")))
            },
            3729: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(1245), (0, n.exportModule)(t, {
                    Features: ["LegacyPhoneFeatures", "GK"]
                }, (e => {
                    var t, r;
                    return (null === (t = e.LegacyPhoneFeatures) || void 0 === t ? void 0 : t.supportsFeature) || (null === (r = e.GK) || void 0 === r ? void 0 : r.supportsFeature)
                }))
            },
            584: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "ImageUtils", (e => e.rotateAndResize))
            },
            4284: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    Locale: "default"
                }, (e => e.default.downloadAndSetTranslation))
            },
            2414: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    MediaBlobCacheImpl: "MediaBlobCacheImpl",
                    MediaBlobCache: "MediaBlobCache"
                }, (e => e.MediaBlobCache))
            },
            952: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    MediaEntry: "MediaEntry"
                }, (e => e.MediaEntry))
            },
            5430: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    MediaObject: "MediaObject"
                }, (e => e.webMediaTypeToWamMediaType))
            },
            2049: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "MediaObjectUtil", (e => e.getOrCreateMediaObject))
            },
            9544: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "MediaPrep", (e => e.MediaPrep))
            },
            4203: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "MediaUtils", (e => e.getImageWidthHeight))
            },
            8576: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    MsgKey: "default"
                }, (e => e.default.toString().includes("MsgKey error: obj is null/undefined")))
            },
            4918: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), r(7590);
                const n = r(8785);
                r(7429), (0, n.exportModule)(t, {
                    MsgLoadState: "MsgLoadState",
                    MsgLoad: "ChatMsgsCollection"
                }, (e => e.MsgLoadState))
            },
            736: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                (0, n.exportModule)(t, {
                    OpaqueDataBase: "default"
                }, (e => e.default.prototype.throwIfReleased)), (0, n.exportModule)(t, {
                    OpaqueData: "default"
                }, (e => e.default.createFromData))
            },
            8971: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    Socket: "Socket"
                }, (e => {
                    var t;
                    return null === (t = e.Socket) || void 0 === t ? void 0 : t.initConn
                }))
            },
            2183: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    Stream: "Stream"
                }, (e => e.Stream))
            },
            7582: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "UserPrefs", (e => e.getMaybeMeUser))
            },
            1057: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "VCard", (e => e.vcardFromContactModel))
            },
            130: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    WapClass: "instance.constructor",
                    Wap: "instance"
                }, (e => {
                    var t;
                    return null === (t = e.instance) || void 0 === t ? void 0 : t.queryExist
                }))
            },
            5624: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    Wid: "default"
                }, (e => e.default.isXWid))
            },
            8370: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "WidFactory", (e => e.createWid))
            },
            3073: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(2064), t), o(r(7562), t), o(r(8101), t), o(r(5847), t), o(r(6031), t), o(r(7563), t), o(r(7169), t), o(r(1245), t), o(r(3729), t), o(r(584), t), o(r(4284), t), o(r(2414), t), o(r(952), t), o(r(5430), t), o(r(2049), t), o(r(9544), t), o(r(4203), t), o(r(8576), t), o(r(4918), t), o(r(736), t), o(r(8971), t), o(r(2183), t), o(r(7582), t), o(r(1057), t), o(r(130), t), o(r(5624), t), o(r(8370), t)
            },
            7383: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "AttachMediaModel")
            },
            9871: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "BlocklistModel")
            },
            1309: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "BusinessCategoriesResultModel")
            },
            7607: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "BusinessProfileModel")
            },
            5248: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "CallModel")
            },
            470: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "CallParticipantModel")
            },
            7789: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "CartItemModel")
            },
            6029: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "CartModel")
            },
            2911: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "CatalogModel")
            },
            8626: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(1241), (0, n.exportProxyModel)(t, "ChatModel")
            },
            4988: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ChatPreferenceModel")
            },
            8368: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportModule)(t, {
                    ChatstateModel: "Chatstate"
                }, (e => e.Chatstate && e.ChatstateCollection))
            },
            9560: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportModule)(t, {
                    ConnModel: "ConnImpl"
                }, (e => e.ConnImpl))
            },
            5573: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ContactModel")
            },
            8021: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ConversionTupleModel")
            },
            6520: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "EmojiVariantModel")
            },
            5190: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "GroupMetadataModel")
            },
            7419: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "LabelItemModel")
            },
            7418: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "LabelModel")
            },
            1433: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "LiveLocationModel")
            },
            3266: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "LiveLocationParticipantModel")
            },
            8115: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "MediaDataModel")
            },
            7994: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(3073), (0, n.exportModule)(t, {
                    Model: "BaseModel"
                }, (e => e.defineModel))
            },
            1241: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportModule)(t, {
                    ModelChatBase: "default"
                }, (e => e.default.toString().includes("onEmptyMRM not implemented")))
            },
            7275: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "MsgButtonReplyMsgModel")
            },
            7184: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "MsgInfoModel")
            },
            1773: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "MsgModel")
            },
            7802: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "MuteModel")
            },
            2673: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "OrderItemModel")
            },
            1690: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "OrderModel")
            },
            2369: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ParticipantModel")
            },
            7986: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportModule)(t, {
                    PresenceModel: "Presence"
                }, (e => e.Presence && e.ChatstateCollection))
            },
            719: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ProductCollModel")
            },
            7496: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ProductImageModel")
            },
            6849: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportModule)(t, {
                    ProductMessageListModel: "ProductMessageList"
                }, (e => e.ProductMessageList))
            },
            1248: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ProductModel")
            },
            704: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ProfilePicThumbModel")
            },
            8179: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "QuickReplyModel")
            },
            1907: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "RecentEmojiModel")
            },
            4e3: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "RecentStickerModel")
            },
            8023: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "ReplyButtonModel")
            },
            2223: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportModule)(t, {
                    Socket: "Socket.constructor"
                }, (e => {
                    var t;
                    return null === (t = e.Socket) || void 0 === t ? void 0 : t.initConn
                }))
            },
            3731: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "StatusModel")
            },
            1225: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "StatusV3Model")
            },
            418: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "StickerModel")
            },
            3507: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "StickerPackModel")
            },
            9053: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportModule)(t, {
                    StreamModel: "Stream.constructor"
                }, (e => e.Stream))
            },
            2156: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "TemplateButtonModel")
            },
            2118: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "UnreadMentionModel")
            },
            8544: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r(8785);
                r(7994), (0, n.exportProxyModel)(t, "WebCallModel")
            },
            7429: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(7383), t), o(r(9871), t), o(r(1309), t), o(r(7607), t), o(r(5248), t), o(r(470), t), o(r(7789), t), o(r(6029), t), o(r(2911), t), o(r(8626), t), o(r(4988), t), o(r(8368), t), o(r(9560), t), o(r(5573), t), o(r(8021), t), o(r(6520), t), o(r(5190), t), o(r(7419), t), o(r(7418), t), o(r(1433), t), o(r(3266), t), o(r(8115), t), o(r(7994), t), o(r(1241), t), o(r(7275), t), o(r(7184), t), o(r(1773), t), o(r(7802), t), o(r(2673), t), o(r(1690), t), o(r(2369), t), o(r(2369), t), o(r(7986), t), o(r(719), t), o(r(7496), t), o(r(6849), t), o(r(1248), t), o(r(704), t), o(r(8179), t), o(r(1907), t), o(r(4e3), t), o(r(8023), t), o(r(2223), t), o(r(3731), t), o(r(1225), t), o(r(418), t), o(r(3507), t), o(r(9053), t), o(r(2156), t), o(r(2118), t), o(r(8544), t)
            },
            6583: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, "adv", (e => e.getADVSecretKey && e.setADVSignedIdentity))
            },
            8803: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__exportStar || function(e, t) {
                        for (var r in e) "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), o(r(6583), t), o(r(5467), t), o(r(9917), t)
            },
            5467: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    waNoiseInfo: "waNoiseInfo"
                }, (e => e.waNoiseInfo))
            },
            9917: (e, t, r) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), (0, r(8785).exportModule)(t, {
                    waSignalStore: "waSignalStore"
                }, (e => e.waSignalStore))
            },
            5786: function(e, t, r) {
                "use strict";
                var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                        void 0 === n && (n = r);
                        var o = Object.getOwnPropertyDescriptor(t, r);
                        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                            enumerable: !0,
                            get: function() {
                                return t[r]
                            }
                        }), Object.defineProperty(e, n, o)
                    } : function(e, t, r, n) {
                        void 0 === n && (n = r), e[n] = t[r]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    i = this && this.__importStar || function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                        return o(t, e), t
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = i(r(7590)),
                    a = r(8785),
                    u = ["BlocklistStore", "BusinessCategoriesResultStore", "BusinessProfileStore", "CallStore", "CartStore", "CatalogStore", "ChatStore", "ContactStore", "EmojiVariantStore", "GroupMetadataStore", "LabelStore", "LiveLocationStore", "MsgStore", "MsgInfoStore", "MuteStore", "OrderStore", "PresenceStore", "ProductMessageListStore", "ProfilePicThumbStore", "QuickReplyStore", "RecentEmojiStore", "StarredStickerStore", "StatusStore", "StatusV3Store", "StickerStore", "StickerSearchStore"];
                for (const e of u) {
                    const r = e.replace("Store", "Collection");
                    (0, a.exportModule)(t, {
                        [e]: ["default", r]
                    }, (e => (e.default || e[r]) instanceof s[r]))
                }(0, a.exportModule)(t, {
                    RecentStickerStore: ["default", "RecentStickerCollectionMd"]
                }, (e => e.RecentStickerCollection)), (0, a.exportModule)(t, {
                    StarredMsgStore: ["default", "AllStarredMsgsCollection"]
                }, (e => e.StarredMsgCollection)), (0, a.exportModule)(t, {
                    StickerPackStore: ["default", "StickerPackCollectionMd", "StickerPackCollection"]
                }, (e => e.StickerPackCollection))
            },
            1504: function(e, t) {
                var r, n;
                void 0 === (n = "function" == typeof(r = function() {
                    "use strict";

                    function e(t) {
                        return e.regex.test((t || "").trim())
                    }
                    return e.regex = /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)$/i, e
                }) ? r.apply(t, []) : r) || (e.exports = n)
            },
            4059: () => {}
        },
        __webpack_module_cache__ = {};

    function __webpack_require__(e) {
        var t = __webpack_module_cache__[e];
        if (void 0 !== t) return t.exports;
        var r = __webpack_module_cache__[e] = {
            exports: {}
        };
        return __webpack_modules__[e].call(r.exports, r, r.exports, __webpack_require__), r.exports
    }
    var __webpack_exports__ = __webpack_require__(3607);
    return __webpack_exports__
})()));




