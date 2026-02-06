// Function to get videos from memory
const getVideos = () => {
    const data = localStorage.getItem('videos');
    return data ? JSON.parse(data) : [];
};

// THE UPLOAD FUNCTION
// THE UPLOAD FUNCTION
function handleUpload(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('vFile');
    const titleInput = document.getElementById('title');
    const submitBtn = document.querySelector('.btn-primary');

    if (!fileInput.files[0]) {
        alert("Please select a video!");
        return;
    }

    // Show "Uploading" so the actor knows it's working
    submitBtn.innerText = "UPLOADING...";
    submitBtn.disabled = true;

    const reader = new FileReader();
    
    reader.onload = function(e) {
        // 1. Clear old data to avoid the 'Quota Exceeded' error
        sessionStorage.clear(); 

        const videoData = {
            title: titleInput.value || "New Video",
            // This is the actual video content converted to text
            content: e.target.result 
        };

        // 2. Save to SessionStorage
        try {
            sessionStorage.setItem('shotVideo', JSON.stringify(videoData));
            // 3. Go to player
            window.location.href = 'video.html?custom=true';
        } catch (error) {
            alert("Video file is too big for the phone's memory! Try a shorter clip.");
            submitBtn.innerText = "PUBLISH";
            submitBtn.disabled = false;
        }
    };

    // This starts the conversion
    reader.readAsDataURL(fileInput.files[0]);
}
// RENDER FEED (For index.html)
function renderFeed() {
    const feed = document.getElementById('videoFeed');
    if (!feed) return;

    const videos = getVideos();
    if (videos.length === 0) {
        feed.innerHTML = "<p style='padding:20px; text-align:center;'>No videos yet.</p>";
        return;
    }

    feed.innerHTML = videos.map(v => `
        <div class="video-card" onclick="location.href='video.html?id=${v.id}'">
            <img src="${v.thumb}" class="thumbnail">
            <div class="video-info">
                <div class="channel-avatar"></div>
                <div>
                    <h2>${v.title}</h2>
                    <p>${v.channel} • ${v.views} views</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Run render when page loads
window.onload = renderFeed;