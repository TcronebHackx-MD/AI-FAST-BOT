import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios';

const searchRepo = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['repo', 'sc', 'script'];

  if (validCommands.includes(cmd)) {
    const repoUrl = `https://api.github.com/repos/TcronebHackx-MD/THE-FAST-BOT`;
    
    await handleRepoCommand(m, Matrix, repoUrl);
  }
};

const handleRepoCommand = async (m, Matrix, repoUrl) => {
  try {
    const response = await axios.get(repoUrl);
    const repoData = response.data;

    const {
      full_name,
      name,
      forks_count,
      stargazers_count,
      created_at,
      updated_at,
      owner,
    } = repoData;

    const messageText = `*_Repository Information:_*\n
*_Name:_* ${name}
*_Stars:_* ${stargazers_count}
*_Forks:_* ${forks_count}
*_Created At:_* ${new Date(created_at).toLocaleDateString()}
*_Last Updated:_* ${new Date(updated_at).toLocaleDateString()}
*_Owner:_* ɪᴍᴀʟᴋᴀ-ʜᴀɴꜱᴀᴍᴀʟ
    `;

    const repoMessage = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: messageText,
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ AI-BOT-MD V1.9𝐀𝐈-𝐁𝐎𝐓-𝗠𝗗 𝐕1.9',
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({
                image: {
                  url: 'https://files.catbox.moe/74pca4.jpg',
                },
              }, { upload: Matrix.waUploadToServer })),
              title: '',
              gifPlayback: true,
              subtitle: '',
              hasMediaAttachment: false,
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Contact Owner',
                    url: 'https://wa.me/+263716394979?text=HI_𝐀𝐈-𝐁𝐎𝐓-𝗠𝗗 𝐕1.9_BOT_OWNER',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Click Here To Fork',
                    url: 'https://github.com/TCRONEBHACKX-MD/THE-FAST-BOT/fork',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Join Our Community',
                    url: 'https://www.whatsapp.com/channel/0029Vafg8mVLtOj6eAvlZO0w/268',
                  }),
                },
              ],
            }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9999,
              isForwarded: true,
            },
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(repoMessage.key.remoteJid, repoMessage.message, {
      messageId: repoMessage.key.id,
    });
    await m.React('✅');
  } catch (error) {
    console.error('Error processing your request:', error);
    m.reply('Error processing your request.');
    await m.React('❌');
  }
};

export default searchRepo;