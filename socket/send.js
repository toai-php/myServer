const Chat = require('../model/Chat');
const User = require('../model/User');
module.exports = async function(data, partner) {
    try {
        var seen = (partner) ? 1 : 0;
        const chat = await Chat.create({
            id_from: data.sender.id,
            id_to: data.receiver.id,
            message: data.content,
            seen: seen,
            room_id: data.room_id,

        }, {
            fields: ['id_from', 'id_to', 'message', 'seen', 'room_id', 'time_created'],
        });
        const sender = await User.findOne({
            attributes: ['phone', 'name', 'avtlink', 'id'],
            where: {
              id: data.sender.id,
            }
          });
          const receiver = await User.findOne({
            attributes: ['phone', 'name', 'avtlink', 'id'],
            where: {
              id: data.receiver.id,
            }
          });
          if(sender != null && receiver != null && chat != null) {
              return {
                  code: '1000',
                sender: {
                    id: sender.id,
                    avtlink: sender.avtlink,
                    name: sender.name,
                },
                receiver: {
                    id:receiver.id,
                    avtlink: receiver.avtlink,
                    name: receiver.name,
                },
                message_id: chat.id,
                created: chat.time_created,
                content: chat.message,
                unread: 1-chat.seen,
              }
              
          }
          else {
            return {
                code: '9999',
                message: 'error'
            }
          }
    } catch (error) {
        return {
            code: '9999',
            error: error,
        }
    }
}