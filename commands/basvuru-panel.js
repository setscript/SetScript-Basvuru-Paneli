const { 
    Client, 
    EmbedBuilder, 
    PermissionsBitField, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle,
    ChannelType,
} = require("discord.js");
const { AttachmentBuilder } = require('discord.js');
const db = require("croxydb");

module.exports = {
    name: "gelistirici-panel",
    description: "Geliştirici başvuru sistemini ayarla",
    type: 1,
    options: [
        {
            name: "basvuru-kanal",
            description: "Başvuru formunun gönderileceği kanal",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "admin-rol",
            description: "Başvuruları inceleyebilecek rol",
            type: 8,
            required: true,
        },
        {
            name: "log-kanal",
            description: "Başvuru loglarının tutulacağı kanal",
            type: 7,
            required: true,
        },
        {
            name: "gelistirici-rol",
            description: "Kabul edilen geliştiricilere verilecek rol",
            type: 8,
            required: true,
        },
        {
            name: "ticket-kategori",
            description: "Ticket kanallarının oluşturulacağı kategori",
            type: 7,
            required: true,
            channel_types: [4]
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ | Bu komutu kullanmak için Yönetici yetkisine sahip olmalısın!")], 
                ephemeral: true 
            });
        }
        const basvuruKanal = interaction.options.getChannel('basvuru-kanal');
        const logKanal = interaction.options.getChannel('log-kanal');
        const adminRol = interaction.options.getRole('admin-rol');
        const gelistiriciRol = interaction.options.getRole('gelistirici-rol');
        const ticketKategori = interaction.options.getChannel('ticket-kategori');

        db.set(`config_${interaction.guild.id}`, {
            basvuruKanal: basvuruKanal.id,
            logKanal: logKanal.id,
            adminRol: adminRol.id,
            gelistiriciRol: gelistiriciRol.id,
            ticketKategori: ticketKategori.id
        });

        const basvuruEmbed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("SetScript.com Geliştirici Başvurusu")
            .setThumbnail('https://avatars.githubusercontent.com/u/195494565?s=200&v=4')
            .setDescription("Geliştirici ekibimize katılın ve kod paylaşım platformunun geleceğini birlikte inşa edelim!")
            .addFields(
                { 
                    name: "Gereksinimler", 
                    value: "• En az 2 yıl programlama deneyimi\n• Web teknolojileri hakkında güçlü bilgi\n• Toplulukta aktif katılım\n• Kod kalitesini değerlendirebilme ve sürdürebilme yeteneği" 
                },
                { 
                    name: "Avantajlar", 
                    value: "• Özel geliştirici özelliklerine erişim\n• Platform geliştirmede doğrudan rol alma\n• Geliştirici topluluğunda tanınırlık\n• Yeni özelliklere erken erişim" 
                }
            )
            .setFooter({ text: "Başvurmak için aşağıdaki butona tıklayın!" });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('basvuru_yap')
                    .setLabel('Başvur')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('💻')
            );

        await basvuruKanal.send({ embeds: [basvuruEmbed], components: [row] });
        await interaction.reply({ content: "Geliştirici başvuru sistemi başarıyla kuruldu!", ephemeral: true });
    }
};

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isButton() && interaction.customId === 'basvuru_yap') {
            const database = db.get(`config_${interaction.guild.id}`);
            if (interaction.member.roles.cache.has(database.gelistiriciRol)) return 
                interaction.reply({ 
                    content: 'Zaten SetScript ekibinde bulunuyorsunuz!',
                    ephemeral: true
                });
            
            const beklemede = db.get("beklemede") || [];
            if (bekleme.includes(`${interaction.user.id}`)) return
                interaction.reply({ 
                    content: 'Zaten açılmış başvuru talebin var!',
                    ephemeral: true
                });
            
            const modal = new ModalBuilder()
                .setCustomId('gelistirici_basvuru')
                .setTitle('Geliştirici Başvuru Formu');

            const sorular = [
                ['isim', 'Ad Soyad', TextInputStyle.Short],
                ['portfolio', 'Portfolio/GitHub Linki', TextInputStyle.Short],
                ['deneyim', 'Deneyim Yılı ve Kullandığın Teknolojiler', TextInputStyle.Paragraph],
                ['katki', 'SetScript\'e Nasıl Katkıda Bulunabilirsin?', TextInputStyle.Paragraph],
                ['proje', 'En Zorlu Projenizi Anlatın', TextInputStyle.Paragraph]
            ];

            sorular.forEach(([id, label, style]) => {
                modal.addComponents(new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId(id)
                        .setLabel(label)
                        .setStyle(style)
                        .setRequired(true)
                ));
            });

            await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'gelistirici_basvuru') {
            const guildConfig = db.get(`config_${interaction.guild.id}`);

            const basvuruEmbed = new EmbedBuilder()
                .setColor("#0099ff")
                .setThumbnail('https://avatars.githubusercontent.com/u/195494565?s=200&v=4')
                .setTitle("Yeni Geliştirici Başvurusu")
                .setDescription(`Başvuran: ${interaction.user.tag}`)
                .addFields(
                    { name: "Ad Soyad", value: interaction.fields.getTextInputValue('isim') },
                    { name: "Portfolio/GitHub", value: interaction.fields.getTextInputValue('portfolio') },
                    { name: "Deneyim", value: interaction.fields.getTextInputValue('deneyim') },
                    { name: "Potansiyel Katkı", value: interaction.fields.getTextInputValue('katki') },
                    { name: "Proje Deneyimi", value: interaction.fields.getTextInputValue('proje') }
                )
                .setTimestamp();

            const ticketKanal = await interaction.guild.channels.create({
                name: `basvuru-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: guildConfig.ticketKategori,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: guildConfig.adminRol,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ]
            });

            const butonlar = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`kabul_${interaction.user.id}`)
                        .setLabel('Kabul Et')
                        .setEmoji('✔')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`red_${interaction.user.id}`)
                        .setLabel('Reddet')
                        .setEmoji('❌')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`kapat_ticket_${ticketKanal.id}`)
                        .setLabel('Ticket\'ı Kapat')
                        .setEmoji('⚠')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`sesli_ac_${interaction.user.id}`)
                        .setLabel('Sesli Kanal Aç')
                        .setEmoji('🔉')
                        .setStyle(ButtonStyle.Primary)
                );

            await ticketKanal.send({ embeds: [basvuruEmbed], components: [butonlar] });
            await interaction.reply({ content: "Başvurunuz alındı! Görüşmek için bir ticket kanalı oluşturuldu.", ephemeral: true });
            db.push("beklemede", `${interaction.user.id}`);
        }

        if (
            interaction.isButton() &&
            (interaction.customId.startsWith('kabul_') ||
                interaction.customId.startsWith('red_') ||
                interaction.customId.startsWith('kapat_ticket_') ||
                interaction.customId.startsWith('sesli_ac_'))
        ) {
            await interaction.deferUpdate();
        
            const guildConfig = db.get(`config_${interaction.guild.id}`);
        
            if (
                (interaction.customId.startsWith('kabul_') ||
                    interaction.customId.startsWith('red_') ||
                    interaction.customId.startsWith('kapat_ticket_')) &&
                !interaction.member.roles.cache.has(guildConfig.adminRol)
            ) {
                return interaction.followUp({
                    content: 'Başvuruları yönetme yetkiniz yok!',
                    ephemeral: true,
                });
            }
        
            if (interaction.customId.startsWith('kabul_')) {
                const userId = interaction.customId.split('_')[1];
                const member = await interaction.guild.members.fetch(userId);
        
                await member.roles.add(guildConfig.gelistiriciRol);
                await interaction.channel.send(
                    `Tebrikler ${member}! Başvurunuz kabul edildi! 🎉`
                );
                db.unpush("beklemede", `${userId}`);
        
                const logEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Geliştirici Başvurusu Kabul Edildi')
                    .setThumbnail('https://avatars.githubusercontent.com/u/195494565?s=200&v=4')
                    .setDescription(
                        `${member.user.tag}'in başvurusu ${interaction.user.tag} tarafından kabul edildi`
                    );
        
                const logKanal = interaction.guild.channels.cache.get(
                    guildConfig.logKanal
                );
                await logKanal.send({ embeds: [logEmbed] });
            }
        
            if (interaction.customId.startsWith('red_')) {
                const userId = interaction.customId.split('_')[1];
                const member = await interaction.guild.members.fetch(userId);
        
                await interaction.channel.send(
                    `${member}, üzgünüz ama başvurunuz reddedildi.`
                );             
                db.unpush("beklemede", `${userId}`);   
                
                const logEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Geliştirici Başvurusu Reddedildi')
                    .setThumbnail('https://avatars.githubusercontent.com/u/195494565?s=200&v=4')
                    .setDescription(
                        `${member.user.tag}'in başvurusu ${interaction.user.tag} tarafından reddedildi`
                    );
        
                const logKanal = interaction.guild.channels.cache.get(
                    guildConfig.logKanal
                );
                await logKanal.send({ embeds: [logEmbed] });
            }
        
            if (interaction.isButton() && interaction.customId.startsWith('kapat_ticket_')) {
                const kanalId = interaction.customId.split('_')[2];
                const kanal = interaction.guild.channels.cache.get(kanalId);
            
                const transcriptRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`transcript_kapat_${kanalId}`)
                            .setLabel('Transcript ile Kapat')
                            .setEmoji('📜')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`direkt_kapat_${kanalId}`)
                            .setLabel('Direkt Kapat')
                            .setEmoji('⚠')
                            .setStyle(ButtonStyle.Danger)
                    );
            
                await interaction.followUp({
                    content: 'Bu ticket’ı nasıl kapatmak istersiniz?',
                    components: [transcriptRow],
                });
            }
      
            if (interaction.customId.startsWith('sesli_ac_')) {
                const userId = interaction.customId.split('_')[2];
                const member = await interaction.guild.members.fetch(userId);
        
                if (
                    interaction.user.id !== userId &&
                    !interaction.member.roles.cache.has(guildConfig.adminRol)
                ) {
                    return interaction.followUp({
                        content:
                            'Yalnızca kendi sesli kanalınızı açabilirsiniz veya admin yetkisine sahip olmalısınız!',
                        ephemeral: true,
                    });
                }
        
                const voiceChannel = await interaction.guild.channels.create({
                    name: `Sesli-${member.user.username}`,
                    type: ChannelType.GuildVoice,
                    parent: guildConfig.ticketKategori,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.Connect], 
                        },
                        {
                            id: member.user.id,
                            allow: [PermissionsBitField.Flags.Connect],
                        },
                        {
                            id: guildConfig.adminRol,
                            allow: [PermissionsBitField.Flags.Connect], 
                        },
                    ],
                });
        
                await interaction.followUp({
                    content: `${member}, sizin için bir ses kanalı oluşturuldu.`
                });
            }
            

        }
        if (interaction.isButton() && interaction.customId.startsWith('transcript_kapat_')) {
            const kanalId = interaction.customId.split('_')[2];
            const kanal = interaction.guild.channels.cache.get(kanalId);
        
            const fetchedMessages = await kanal.messages.fetch({ limit: 100 });
        
            const transcriptTXT = fetchedMessages
                .map(msg => `[${msg.createdAt}] ${msg.author.tag}: ${msg.content}`)
                .reverse()
                .join('\n');
        
            const fileName = `transcript_${kanal.name}.txt`;
        
            const transcriptBuffer = Buffer.from(transcriptTXT, 'utf-8'); 
        
            const transcriptAttachment = new AttachmentBuilder()
                .setFile(transcriptBuffer)
                .setName(fileName);
        
            const logKanalId = db.get(`config_${interaction.guild.id}`).logKanal;
            const logKanal = interaction.guild.channels.cache.get(logKanalId);
        
            if (logKanal) {
                await logKanal.send({
                    content: `Ticket ${kanal.name} transcript’i:`,
                    files: [transcriptAttachment]
                });
            }
        
            const voiceChannel = interaction.guild.channels.cache.find(c => c.name.includes(`Sesli-${kanal.name.split('-')[1]}`));
            if (voiceChannel) await voiceChannel.delete();
        
            await kanal.delete();
        
            await interaction.reply({
                content: 'Ticket transcript ile birlikte kapatıldı.',
                ephemeral: true
            });
        }
        
        

        
        
        
        
        if (interaction.isButton() && interaction.customId.startsWith('direkt_kapat_')) {
            const kanalId = interaction.customId.split('_')[2];
            const kanal = interaction.guild.channels.cache.get(kanalId);
        
            await interaction.reply({
                content: 'Ticket kapatılıyor...',
                ephemeral: true
            });
        
            setTimeout(async () => {
                const voiceChannel = interaction.guild.channels.cache.find(c => 
                    c.name.includes(`Sesli-${kanal.name.split('-')[1]}`)
                );
                if (voiceChannel) await voiceChannel.delete();
        
                await kanal.delete();
        
            }, 5000); 
        }
        

        
    } catch (error) {
        console.error('');
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.', ephemeral: true });
            }
        } catch (err) {
        }
    }
});
