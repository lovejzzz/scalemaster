// Title Animation Handler
class TitleAnimator {
    constructor() {
        this.animationImages = [];
        this.currentIndex = 0;
        this.animationInterval = null;
        this.ANIMATION_SPEED = 100; // milliseconds between frames
        this.ANIMATION_DURATION = 2000; // total animation duration in milliseconds
        this.initialTitleSrc = './asset/Title.gif'; // Store the initial title source
    }

    // Load all images from the TitleAnimation folder
    async loadAnimationImages() {
        try {
            // Create the list of image paths with relative paths
            this.animationImages = [
                './asset/TitleAnimation/Title2.gif',
                './asset/TitleAnimation/Title3.gif',
                './asset/TitleAnimation/Title4.gif',
                './asset/TitleAnimation/Title5.gif',
                './asset/TitleAnimation/Title6.gif',
                './asset/TitleAnimation/Title7.gif',
                './asset/TitleAnimation/Title8.gif',
                './asset/TitleAnimation/Title9.gif',
                './asset/TitleAnimation/Title10.gif',
                './asset/TitleAnimation/Title11.gif',
                './asset/TitleAnimation/Title12.gif'
            ];
            
            // Shuffle the array
            for (let i = this.animationImages.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.animationImages[i], this.animationImages[j]] = 
                [this.animationImages[j], this.animationImages[i]];
            }
            
            
            
            // Preload images
            await Promise.all(this.animationImages.map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => reject();
                    img.src = src;
                });
            })).catch(() => false);
            
            return true;
        } catch (error) {
            return false;
        }
    }

    // Start the shuffling animation
    startAnimation(currentTitleSrc, onAnimationComplete) {
        
        
        if (this.animationImages.length === 0) {
            console.warn('No animation images available');
            return;
        }

        let startTime = Date.now();
        const titleImage = document.querySelector('.title-image');
        if (!titleImage) {
            console.error('Title image element not found');
            return;
        }

        

        // Add click event listener to reset to initial title
        const resetToInitial = () => {
            titleImage.src = this.initialTitleSrc;
            titleImage.removeEventListener('click', resetToInitial);
        };

        titleImage.addEventListener('click', resetToInitial);

        // Store original properties
        const originalWidth = titleImage.width;
        const originalHeight = titleImage.height;
        const originalStyle = titleImage.style.cssText;

        // Ensure the new images maintain the same size
        titleImage.style.width = `${originalWidth}px`;
        titleImage.style.height = `${originalHeight}px`;

        this.animationInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed >= this.ANIMATION_DURATION) {
                // Stop animation
                clearInterval(this.animationInterval);
                
                // Select final image
                const finalImage = this.animationImages[this.animationImages.length - 1];
                console.log('Setting final image:', finalImage);
                titleImage.src = finalImage;
                
                // Restore original styling but keep the new source
                titleImage.style.cssText = originalStyle;
                
                if (onAnimationComplete) {
                    onAnimationComplete(finalImage);
                }
                return;
            }

            // During animation, rapidly cycle through images
            this.currentIndex = (this.currentIndex + 1) % this.animationImages.length;
            
            titleImage.src = this.animationImages[this.currentIndex];
            
        }, this.ANIMATION_SPEED);
    }

    // Stop the animation immediately
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
}

// Export the animator instance
const titleAnimator = new TitleAnimator();
export { titleAnimator };
