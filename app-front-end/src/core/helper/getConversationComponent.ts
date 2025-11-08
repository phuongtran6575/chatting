// Helper function để lấy tên hiển thị
export   const getConversationDisplayName = (conversation: any, currentUser: any) => {
        if (conversation?.type === 'group') {
            return conversation.name;
        }
        //console.log("conversation:", conversation);
        //console.log("currentUser:", currentUser);
        // Với single chat, tìm participant không phải current user
        const otherParticipant = conversation?.participants?.find( (p: any) => p.id !== currentUser?.id );
        
        //console.log("Other Participant:", otherParticipant);
        return otherParticipant?.full_name || 'Unknown User';
    };

    // Helper function để lấy avatar
export  const getConversationAvatar = (conversation: any, currentUser: any) => {
        if (conversation.type === 'group') {
            return conversation.avatar_url || "https://i.pravatar.cc/150?img=11";
        }

        // Với single chat, lấy avatar của người còn lại
        const otherParticipant = conversation.participants?.find(
            (p: any) => p.id !== currentUser?.id
        );

        return otherParticipant?.avatar_url || "https://i.pravatar.cc/150?img=11";
    };