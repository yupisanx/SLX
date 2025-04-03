import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const NAV_BAR_HEIGHT = 80; // Height of the navigation bar

const BottomSheet = ({ children, isVisible, onClose, initialSnapPoint = 0 }) => {
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef(null);

  // Calculate available height (screen height minus navigation bar)
  const availableHeight = SCREEN_HEIGHT - NAV_BAR_HEIGHT - (Platform.OS === 'ios' ? insets.bottom : 0);
  
  // Calculate snap points to match Gymshark example
  const snapPoints = useMemo(() => {
    const minHeight = Math.floor(availableHeight * 0.15); // Initial height (15% of available space)
    const maxHeight = Math.floor(availableHeight * 0.8); // Max height (80% of available space)
    return [minHeight, maxHeight];
  }, [availableHeight]);

  const handleSheetChanges = useCallback((index) => {
    // Don't call onClose when the sheet changes position
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="none"
        style={[props.style, { zIndex: -1 }]}
      />
    ),
    []
  );

  useEffect(() => {
    if (isVisible) {
      try {
        bottomSheetModalRef.current?.present();
      } catch (error) {
        console.error('Error presenting bottom sheet:', error);
      }
    }
    
    return () => {
      try {
        bottomSheetModalRef.current?.dismiss();
      } catch (error) {
        // Ignore errors during cleanup
      }
    };
  }, [isVisible]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.indicator}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      enableOverDrag={false}
      bottomInset={NAV_BAR_HEIGHT}
      style={styles.bottomSheet}
      android_keyboardInputMode="adjustResize"
      handleStyle={styles.handleContainer}
    >
      <View style={styles.contentContainer} pointerEvents="box-none">
        {children}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'transparent',
  },
  bottomSheetBackground: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#d8b4fe',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#d8b4fe',
      },
      android: {
        elevation: 50,
        shadowColor: '#d8b4fe',
        shadowOpacity: 0.8,
        shadowRadius: 24,
        borderWidth: 0.4,
        borderColor: '#d8b4fe',
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 0.4,
        overflow: 'hidden',
      },
    }),
  },
  handleContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#000000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      android: {
        elevation: 50,
        shadowColor: '#d8b4fe',
        shadowOpacity: 0.8,
        shadowRadius: 24,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 0.4,
        borderColor: '#d8b4fe',
      },
    }),
  },
  indicator: {
    backgroundColor: '#d8b4fe',
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default BottomSheet; 