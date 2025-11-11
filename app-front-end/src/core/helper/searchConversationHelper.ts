export const findConversationWithUser = (userId: string) => {
        return conversations.find((conv: any) => {
            // Chỉ tìm trong single conversations
            if (conv.type !== "single") return false;
            
            // Flatten participants nếu là nested array
            const participants = Array.isArray(conv.participants[0])
                ? conv.participants.flat()
                : conv.participants;
            
            // Kiểm tra xem user có trong conversation không
            return participants.some((p: any) => p.id === userId);
        });
    };

    // 👇 XỬ LÝ KHI CLICK VÀO USER TRONG SEARCH RESULT
export const handleSelectUserFromSearch = (user: any) => {
        console.log("🔍 User clicked from search:", user.full_name);
        
        // Tìm conversation với user này
        const existingConversation = findConversationWithUser(user.id);
        
        if (existingConversation) {
            console.log("✅ Found existing conversation:", existingConversation.id);
            
            // Nếu ĐÃ có conversation → Chọn conversation đó
            onSelectConversation(existingConversation);
            
            // Clear search
            setIsSearching(false);
            setSearchTerm("");
        } else {
            console.log("ℹ️ No conversation found with user:", user.full_name);
            console.log("   User can start a new chat by sending a message");
            
            // Nếu CHƯA có conversation → Chọn user (để có thể tạo mới khi gửi tin)
            onSelectUser(user);
            
            // Clear search
            setIsSearching(false);
            setSearchTerm("");
        }
    };